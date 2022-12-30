import { CategoryResponse } from "src/app/api/models/Categories/category-response";

export interface CategoryNode {
    expandable: boolean;
    level: number;
    category: CategoryResponse;
    subCategories: CategoryResponse[];
}
