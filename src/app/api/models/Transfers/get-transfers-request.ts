import { PaginationOptions } from "../Shared/Search/Pagination/pagination-options";
import { SortingOptions } from "../Shared/Search/Sorting/sorting-options";

export interface GetTransfersRequest {
    pagination: PaginationOptions;
    sorting: SortingOptions;
}
