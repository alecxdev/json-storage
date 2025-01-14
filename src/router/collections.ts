import { Router, Request, Response } from 'express';
import { SuccessResponse } from '../core/response';
import { BadRequestError, NotFoundError, ServerError } from '../exceptions';
import { CollectionRequest } from '../types/app-request';
import { Collection } from '../types/collection';
import { LocalCollectionRepository } from '../repositories/local-collection-repository';
import fn from '../utils/async-handler';
import { convertPath, reduceObject } from '../utils/collection';

const router = Router();

const collectionRepo: Collection.Repository = new LocalCollectionRepository();

router.get('/', fn(async (req, res) => {
  const collections = await collectionRepo.getAll()

  if (!collections) {
    throw new ServerError();
  }

  return new SuccessResponse().send(res, collections);
}));

router.post('/', fn(async (req, res) => {
  if (!req.body) {
    throw new BadRequestError();
  }

  let body: object;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : JSON.parse(JSON.stringify(req.body));

    console.log(body, req.body);
  } catch {
    throw new BadRequestError();
  }

  /*if (!Array.isArray(body) && !Object.keys(body).length) {
    throw new BadRequestError('No empty object');
  }*/

  const collection = await collectionRepo.create({ payload: body })

  return new SuccessResponse().send(res, collection)
}));

router.delete('/:id', fn(async (req, res) => {
  const { id } = req.params;

  await collectionRepo.delete(id);

  return new SuccessResponse().send(res, undefined);
}));

router.put('/:id', fn(async (req, res) => {
  const { params: { id }, body } = req;

  if (typeof body !== 'object') {
    throw new Error();
  }

  const collection = await collectionRepo.update({ ...body, id });
  
  return new SuccessResponse().send(res, collection);
}));

router.use('/:id', fn(async (expressReq, res, next) => {
  const req = expressReq as CollectionRequest;
  const { id } = req.params;
  let collection = await collectionRepo.getById(id);
  
  if (!collection) {
    throw new NotFoundError();
  }

  req.collection = collection;

  next();
}));

// router.get(/\/./g, (req: Request, res: Response) => {
//   console.log(req.path);
//   (req as unknown as CollectionRequest).coll

//   res.json(['regex']);
// });

router.get('/:id*', (req: Request, res: Response) => {
  const { collection }  = req as CollectionRequest;
  const [_, ...path] = convertPath(req.path)

  try {
    const reducedCollection = reduceObject(collection.payload, path)

    return new SuccessResponse().send(res, reducedCollection);
  } catch(e) {
    throw new BadRequestError((e as Error).message);
  }
});

export default router;
