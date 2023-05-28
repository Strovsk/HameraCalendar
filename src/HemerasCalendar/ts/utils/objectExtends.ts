export function objectExtends<T>(objA: T, objB: Partial<T>): T {
    const result = objA;

    for (let key in result) {
        if (!objB[key]) continue;
    
        if (typeof result[key] === 'function') continue;
    
        if (typeof result[key] === 'object') {
            result[key] = objectExtends(
                result[key],
                objB[key] as Partial<typeof result[typeof key]>,
            );
            continue;
        }
    
        result[key] = objB[key] as typeof result[typeof key];
    }
    return result;
}
