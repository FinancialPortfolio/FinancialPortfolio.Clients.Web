import * as moment from "moment";

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
    let result = getValueByPath(item, key);

    var date = moment(result);
    if (date.isValid())
        return date;

    if (isNaN(result))
        return result;

    return Number(result);
}

function getValueByPath(item: any, key: string) {
    return key.split('.').reduce((previous, current) => previous[current], item);
}
