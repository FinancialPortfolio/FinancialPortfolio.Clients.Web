import { PaginationOptions } from "../Shared/Search/Pagination/pagination-options";
import { SortingOptions } from "../Shared/Search/Sorting/sorting-options";

export interface GetAssetsRequest {
    pagination: PaginationOptions | null;
    sorting: SortingOptions | null;
    name: string | null;
    symbol: string | null;
    type: string | null;
}
