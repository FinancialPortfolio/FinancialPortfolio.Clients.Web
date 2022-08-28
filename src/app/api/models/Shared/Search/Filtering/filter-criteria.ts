import { FilterOperator as FinancialPortfolioSearchFilteringFilterOperator } from './filter-operator';
export interface FilterCriteria {
    field?: null | string;
    operator?: FinancialPortfolioSearchFilteringFilterOperator;
    value?: null | string;
}
