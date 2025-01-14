export const convertPath = (path: string) => path.split('/').filter((q) => q.length);

export const reduceObject = (object: unknown, properties: string[]) => {
  let data = object;

  for(const key of properties) {
    if (data && typeof data === 'object' && key in data) {
      data = data[key as keyof typeof data];
      
      continue;
    }

    throw new Error(`Error accessing ${key} key.`);
  }

  return data;
}

export const extendObject = <T>(object: T, addedObj: unknown, location: string[]): T => {
  const clone = structuredClone(object);
  let data: unknown = clone;

  if (!location.length) {
    throw new Error('Property location cannot be empty.');
  }

  const lastKey = location.pop()!;

  for (const key of location) {
    if (data && typeof data === 'object' && key in data && typeof data[key as keyof typeof data] === 'object') {
      data = data[key as keyof typeof data];

      continue;
    }

    throw new Error(`Error on reaching ${key} property.`);
  }

  (data as Record<string, unknown>)[lastKey] = addedObj;

  return clone;
}
