import { AssetResponse } from "./asset-response";
import { CategoryResponse } from "./category-response";

export interface UpdateCategoryRequest {
    name: string;
    description: string;
    expectedAllocationInPercentage: number;
    userId: string;
    subCategories: CategoryResponse[];
    assets: AssetResponse[];
}
