import { FilterOperator } from './filter-operator';

export interface FilterCriteria {
    field: string;
    operator: FilterOperator;
    value: string;
}
