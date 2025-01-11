import { Collection } from './collection';

export declare interface CollectionRequest extends Request {
    collection: Collection;
    id: string;
    properties: string[];
}
