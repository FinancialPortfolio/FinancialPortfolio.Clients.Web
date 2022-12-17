import { AssetResponse } from "./asset-response";

export interface CategoryResponse {
    id: string;
    name: string;
    description: string;
    allocation: number;
    allocationInPercentage: number;
    expectedAllocationInPercentage: number;
    userId: string;
    subCategories: CategoryResponse[];
    assets: AssetResponse[];
}
