import { extendObject } from '../src/utils/collection';

describe('Utils functions', () => {

    it('should add the value to an existing object', () => {
        const obj = { person: { name: 'John' }};
        const result = extendObject(obj, 40, ['person', 'age']);

        expect(result).toEqual({ person: { name: 'John', age: 40 }});
    });

    it('should add a new key to object', () => {
        const obj = {};
        const result = extendObject(obj, ['a', 'b'], ['arr']);

        expect(result).toEqual({ arr: ['a', 'b']});
    });

    it('should add a key inside an object inside an array', () => {
        const obj = { arr: [0, 1, { obj: 3 }] };
        const result = extendObject(obj, 'smosh', ['arr', '2', 'cast',]);

        expect(result).toEqual({ arr: [0, 1, { obj: 3, cast: 'smosh' }]});
    });
});
