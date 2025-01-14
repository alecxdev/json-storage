export const convertPath = (path: string) => path.split('/').filter((q) => q.length);

export const reduceObject = (object: unknown, properties: string[]) => {
    let data = object;

    for(const key of properties) {
      if (data && typeof data === 'object' && key in data) {
        data = data[key as keyof typeof data];
        
        continue;
      }

      throw new Error('');
    }

    return data;
  }