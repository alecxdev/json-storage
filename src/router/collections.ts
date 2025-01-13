import { Router, Request, Response } from 'express';
import { SuccessResponse } from '../core/response';
import { BadRequestError, ServerError } from '../exceptions';
import { CollectionRequest } from '../types/app-request';
import { Collection } from '../types/collection';
import { LocalCollectionRepository } from '../repositories/local-collection-repository';
import fn from '../utils/async-handler';

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

// router.use('/:id', (req, res, next) => {
//   next();
// });


// type RequestWithId = Request<{ id: string }> & {
//   id: string;
//   content: any;
// };

router.use('/:id', fn(async (req, res, next) => {
  const { id } = req.params;
  const properties = req.path.split('/').filter((q) => q.length);

  try {
    let data: any = await collectionRepo.getById(id, properties);
    const entries = [
      ['id', id],
      ['collection', data],
      ['properties', properties]
    ]  as const;

    for (const [key, value] of entries) {
      (req as unknown as CollectionRequest)[key] = value;
    }

    next();
  } catch(e) {
    throw new ServerError();
  }
}));

// router.get(/\/./g, (req: Request, res: Response) => {
//   console.log(req.path);
//   (req as unknown as CollectionRequest).coll

//   res.json(['regex']);
// });

router.get('/:id*', (req: Request, res: Response) => {
  // Your route handler logic here
  const { collection }  = (req as unknown as CollectionRequest);

  return new SuccessResponse().send(res, collection);
});

export default router;
