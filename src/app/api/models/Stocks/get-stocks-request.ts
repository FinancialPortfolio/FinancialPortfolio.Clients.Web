import { PaginationOptions } from "../Shared/Search/Pagination/pagination-options";
import { SortingOptions } from "../Shared/Search/Sorting/sorting-options";

export interface GetStocksRequest {
    pagination: PaginationOptions;
    sorting: SortingOptions;
}
