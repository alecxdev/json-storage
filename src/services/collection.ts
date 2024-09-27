import { readdir, readFile, writeFile } from 'node:fs/promises';

const STORAGE_URL = './src/db';

export const getCollections = async () => {
    try {
        const dir = await readdir(STORAGE_URL);

        return dir.filter(file => file.endsWith('.json')).map(file => file.replace(/.json$/, ''));
    } catch {
        return undefined;
    }
}

export const getCollectionById = async (id: string) => {
    try {
        const content = await readFile(`${STORAGE_URL}/${id}.json`, { encoding: 'utf-8' });

        return JSON.parse(content);
    } catch {
        return undefined;
    }
}

export const createCollection = async (body: any) => {
    const uuid = Date.now(); // crypto.randomUUID();
    try {
        await writeFile(`${STORAGE_URL}/${uuid}.json`, JSON.stringify(body));

        return uuid;
    } catch {
        return undefined;
    }
}
