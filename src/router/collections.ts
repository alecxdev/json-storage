import { Router, Request, Response } from 'express';
import { SuccessResponse } from '../core/response';
import { BadRequestError, NotFoundError, ServerError } from '../exceptions';
import { CollectionRequest } from '../types/app-request';
import { Collection } from '../types/collection';
import { LocalCollectionRepository } from '../repositories/local-collection-repository';
import fn from '../utils/async-handler';
import { convertPath, extendObject, reduceObject } from '../utils/collection';

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

  // if (typeof req.body !== 'object') {
  //   throw new BadRequestError('JSON must be an object');
  // }

  body = req.body

  /*if (!Array.isArray(body) && !Object.keys(body).length) {
    throw new BadRequestError('No empty object');
  }*/

  const collection = await collectionRepo.create({ payload: body })

  if (!collection) {
    throw new ServerError();
  }

  return new SuccessResponse().send(res, collection)
}));

router.delete('/:id', fn(async (req, res) => {
  const { id } = req.params;

  await collectionRepo.delete(id);

  return new SuccessResponse().send(res, undefined);
}));

router.put('/:id', fn(async (req, res) => {
  const { params: { id }, body } = req;

  // if (typeof body !== 'object') {
  //   throw new Error();
  // }

  const collection = await collectionRepo.update({ id, payload: body });

  if (!collection) {
    throw new ServerError();
  }
  
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

router.get('/:id*', (req: Request, res: Response) => {
  const { collection }  = req as CollectionRequest;
  const [_id, ...path] = convertPath(req.path);

  try {
    const reducedCollection = reduceObject(collection.payload, path)

    return new SuccessResponse().send(res, reducedCollection);
  } catch(e) {
    throw new BadRequestError((e as Error).message);
  }
});

router.post('/:id*', fn(async (req: Request, res: Response) => {
  const { collection: collection_ }  = req as CollectionRequest;
  const [_id, ...path] = convertPath(req.path)

  try {

    const payload = extendObject(collection_.payload, req.body, path);
    const collection = await collectionRepo.update({ id: collection_.id, payload });

    if (!collection) {
      throw new Error('Couldn\'t add to the object');
    }

    const reducedCollection = reduceObject(collection.payload, path)

    return new SuccessResponse().send(res, reducedCollection);
  } catch(e) {
    throw new BadRequestError((e as Error).message);
  }
}));

router.delete('/:id*', fn(async (req, res) => {
  const { collection: collection_ }  = req as CollectionRequest;
  const [_id, ...path] = convertPath(req.path);

  if (!path.length) {
    // remove from database
    await collectionRepo.delete(_id);

    return new SuccessResponse().send(res, undefined);
  }

  const lastKey = path.pop()!;
  const obj = reduceObject(collection_.payload, path);

  if (!obj || typeof obj !== 'object' || !(lastKey in obj)) {
    throw new BadRequestError(`Error accessing ${lastKey} key`);
  }

  if (Array.isArray(obj)) {
    if (Number.isNaN(Number(lastKey))) {
      throw new BadRequestError('Key is not an index');
    }

    obj.splice((Number(lastKey)), 1);
  } else {
    delete obj[lastKey as keyof typeof obj];
  }

  const collection = await collectionRepo.update(collection_);

  if (!collection) {
    throw new ServerError();
  }

  return new SuccessResponse().send(res, undefined);
  // return new SuccessResponse().send(res, collection.payload);
}));

export default router;
