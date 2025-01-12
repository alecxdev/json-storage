export interface Repository<T, ID_KEY extends keyof T = Extract<'id', keyof T>> {
    getAll(): Promise<T[] | undefined>;
    getById(id: T[ID_KEY]): Promise<T | undefined>;
    create(item: Omit<T, ID_KEY>): Promise<T | undefined>;
    update(item: T): Promise<T | undefined>;
    delete(id: T[ID_KEY]): Promise<void>;
}
