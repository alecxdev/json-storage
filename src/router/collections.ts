import { Router, Request, Response } from 'express';
import { BadRequestError, NotFoundError, ServerError } from '../exceptions';
import { Collections } from '../services';
import fn from '../utils/async-handler';

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

router.use('/:id', fn(async (req: Request, res: Response) => {
  if (!['GET'].includes(req.method.toUpperCase())) {
    throw new NotFoundError();
  }

  const { id } = req.params;
  const properties = req.path.split('/').filter((q) => q.length);

  try {
    let data: any = await Collections.getCollectionById(id, properties);

    res.json({ response: data, success: true });
  } catch {
    throw new ServerError();
  }
}));

export default router;
