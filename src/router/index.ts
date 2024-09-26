import { Router } from 'express';
import collectionsRoute from './collections';

const router = Router();

router.use('/collections', collectionsRoute);

export default router;
