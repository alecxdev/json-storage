import { Router, Request, Response } from 'express';
import { BadRequestError, ServerError } from '../exceptions';
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

router.use('/:id', fn(async (req: Request, res: Response, next) => {
  const { id } = req.params;
  const properties = req.path.split('/').filter((q) => q.length);

  let data: any | undefined = await Collections.getCollectionById(id);

  if (!id || !data) {
    throw new BadRequestError();
  }

  if (!properties.length) {
    res.json({ response: data, success: true })
  } else {
    let property: string
    for (property of properties) {

      // TODO - check array
      if (!(property in data)) {
        throw new BadRequestError()
      }

      data = data[property];
    }

    res.json({
      response: { [property!]: data },
      success: true
    });
  }
}));

export default router;
