import { writeFile } from 'node:fs/promises';

export const createCollection = async (body: any) => {
    const uuid = Date.now(); // crypto.randomUUID();
    try {
        await writeFile(`./src/db/${uuid}.json`, JSON.stringify(body));

        return uuid;
    } catch {
        return undefined;
    }
}
