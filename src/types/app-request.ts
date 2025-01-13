import { Collection } from './collection';

export declare interface CollectionRequest extends Request {
    id: string;
    collection: Collection;
    properties: string[];
}
