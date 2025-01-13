import { Repository as RepositoryType } from './repository';

export interface Collection {
    id: string;
    payload: unknown
}

export namespace Collection {
    export interface Repository extends RepositoryType<Collection> {
        getById(id: Collection['id'], path?: string[]): Promise<Collection>;
    }
}