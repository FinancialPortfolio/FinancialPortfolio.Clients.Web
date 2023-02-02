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

    let number = Number(result);
    if (!isNaN(number))
        return number;

    var date = moment(result);
    if (date.isValid())
        return date;

    return result;
}

function getValueByPath(item: any, key: string) {
    return key.split('.').reduce((previous, current) => previous[current], item);
}
