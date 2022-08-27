/* tslint:disable */
/* eslint-disable */
import { FilteringOptions as FinancialPortfolioSearchFilteringFilteringOptions } from '../../FinancialPortfolio/Search/Filtering/filtering-options';
import { PaginationOptions as FinancialPortfolioSearchPaginationPaginationOptions } from '../../FinancialPortfolio/Search/Pagination/pagination-options';
import { SortingOptions as FinancialPortfolioSearchSortingSortingOptions } from '../../FinancialPortfolio/Search/Sorting/sorting-options';
export interface SearchOptions {
    filteringOptions?: FinancialPortfolioSearchFilteringFilteringOptions;
    paginationOptions?: FinancialPortfolioSearchPaginationPaginationOptions;
    sortingOptions?: FinancialPortfolioSearchSortingSortingOptions;
}
