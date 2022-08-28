import { AssetType } from "./asset-type";

export interface CreateAssetRequest {
    symbol: string;
    name: string;
    type: AssetType;
}
