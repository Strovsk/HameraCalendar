export function objectExtends(objA: object, objB: object): object {
    const result = objA;

    const objectBKeys = Object.keys(objB);

    for (let key in result) {
        if (!objectBKeys.includes(key)) continue;
    
        if (typeof result[key] === 'function') continue;
    
        if (typeof result[key] === 'object') {
            result[key] = objectExtends(result[key], objB[key]);
            continue;
        }
    
        result[key] = objB[key];
    }
    return result;
}
