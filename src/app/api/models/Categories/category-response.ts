import { StockResponse } from "./stock-response";

export interface CategoryResponse {
    id: string;
    name: string;
    description: string;
    expectedAllocation: number;
    allocation: number;
    userId: string;
    subCategories: CategoryResponse[];
    stocks: StockResponse[];
}
