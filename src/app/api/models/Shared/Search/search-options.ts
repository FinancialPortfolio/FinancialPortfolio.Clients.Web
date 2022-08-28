import { FilteringOptions as FinancialPortfolioSearchFilteringFilteringOptions } from './Filtering/filtering-options';
import { PaginationOptions as FinancialPortfolioSearchPaginationPaginationOptions } from './Pagination/pagination-options';
import { SortingOptions as FinancialPortfolioSearchSortingSortingOptions } from './Sorting/sorting-options';
export interface SearchOptions {
    filteringOptions?: FinancialPortfolioSearchFilteringFilteringOptions;
    paginationOptions?: FinancialPortfolioSearchPaginationPaginationOptions;
    sortingOptions?: FinancialPortfolioSearchSortingSortingOptions;
}
