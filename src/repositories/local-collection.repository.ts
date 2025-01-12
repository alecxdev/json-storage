import { readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { Collection } from '../types/collection';
import { Repository } from '../types/repository';
import { BadRequestError, NotFoundError, ServerError } from '../exceptions';

const STORAGE_URL = './src/db';

export class LocalCollectionRepository implements Collection.Repository {
    async getAll(): Promise<Collection[] | undefined> {
        try {
            const dir = await readdir(STORAGE_URL);
    
            return dir.filter(file => file.endsWith('.json'))
            .map<Collection>(file => ({ id: file.replace(/.json$/, ''), data: file }));
        } catch {
            return undefined;
        }
    }

    async getById(id: string, path?: string[]): Promise<Collection> {
        try {
            const content = await readFile(`${STORAGE_URL}/${id}.json`, { encoding: 'utf-8' });
            let data: Collection['data'] = JSON.parse(content);
    
            if (!path?.length) {
                return { id, data };
            }
    
            for (const property of path) {
                if (data && typeof data === 'object' && property in data) {
                    data = data[property as keyof typeof data];

                    continue;
                }

                throw new BadRequestError()
            }

            return { id, data };
        } catch {
            throw new ServerError();
        }
    }

    async create(collection: Omit<Collection, 'id'>): Promise<Collection | undefined> {
        const uuid = `${Date.now()}`; // crypto.randomUUID();
        try {
            await writeFile(`${STORAGE_URL}/${uuid}.json`, JSON.stringify(collection));
    
            return { data: collection.data, id: uuid };
        } catch (error) {
            return undefined
        }
    }

    async update(collection: Collection): Promise<Collection> {
        try {
            await writeFile(`${STORAGE_URL}/${collection.id}.json`, JSON.stringify(collection));
    
            return collection;
        } catch {
            throw new ServerError();
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await rm(`${STORAGE_URL}/${id}.json`, );
        } catch {
            throw new NotFoundError()
        }
    }

}

const localRepo = new LocalCollectionRepository();
localRepo.create({ data: '' })

localRepo.getById('').then(v => v.id)

interface A {
    name: string;
}

interface B extends A {
    id: string;
}