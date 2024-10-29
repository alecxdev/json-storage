import { Router, Request, Response } from 'express';
import { BadRequestError, NotFoundError, ServerError } from '../exceptions';
import { Collections } from '../services';
import fn from '../utils/async-handler';
import { CollectionRequest } from '../types/app-request';
import { SuccessResponse } from '../core/response';

const router = Router();

router.get('/', fn(async (req, res) => {
  const collections = await Collections.getCollections()

  if (!collections) {
    throw new ServerError();
  }

  res.json({ data: collections });
}));

router.post('/', fn(async (req, res) => {
  if (!req.body) {
    throw new BadRequestError();
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!Array.isArray(body) && !Object.keys(body).length) {
      throw new BadRequestError();
    }
  } catch (err) {
    throw err;
  }

  const id = await Collections.createCollection(body)

  res.json(id);
}));

router.delete('/:id', fn(async (req, res) => {
  const { id } = req.params;

  try {
    await Collections.deleteCollection(id)
    res.json({ success: true });
  } catch (error) {
    throw error;
  }
}));

router.put('/:id', fn(async (req, res) => {
  const { params: { id }, body } = req;

  if (typeof body !== 'object') {
    throw new Error();
  }

  try {
    const response = await Collections.updateCollection(id, body);
    
    res.json({ success: true, response });
  } catch (error) {
    throw error;
  }
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
    let data: any = await Collections.getCollectionById(id, properties);
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
  const { id, collection, properties }  = (req as unknown as CollectionRequest);

  console.log('id *', id, collection, properties);

  console.log('id:', req.params.id);

  return new SuccessResponse().send(res, 'hola mundo');
})


export default router;
