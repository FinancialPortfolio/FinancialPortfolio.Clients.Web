import { StockResponse } from "./stock-response";

export interface CategoryResponse {
    id: string;
    name: string;
    description: string;
    allocation: number;
    allocationInPercentage: number;
    expectedAllocationInPercentage: number;
    userId: string;
    subCategories: CategoryResponse[];
    stocks: StockResponse[];
}
