export function sortArray(array: any[], key: string, asc: boolean): any[] {
    return array.sort((a, b) => {
        let aValue = getValue(a, key);
        let bValue = getValue(b, key);

        if (asc)
            return aValue < bValue ? -1 : 1;
        else
            return aValue > bValue  ? -1 : 1;
    });
}

function getValue(item: any, key: string) {
    let result = item[key];
    if (isNaN(result))
        return result;

    return Number(result);
}
