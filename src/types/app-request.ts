import { Request } from 'express';
import { Collection } from './collection';

export declare interface CollectionRequest extends Request {
    collection: Collection;
}
