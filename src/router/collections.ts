import { Router, Request, Response } from 'express';
import json from '../db/data.json';
import { BadRequestError } from '../exceptions';

const router = Router();
router.get('/', (req, res) => {
  res.json({ data: Object.keys(json) });
});

router.use('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const properties = req.path.split('/').filter((q) => q.length);

  let data: Record<string, any> = json;

  if (!id || !(json as any)[id]) {
    throw new BadRequestError();
  }

  if (!properties.length) {
    res.json({response: data})
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
});

export default router;
