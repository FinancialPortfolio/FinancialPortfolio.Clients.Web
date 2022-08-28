import { AssetType } from "./asset-type";

export interface CreateAssetRequest {
    name: string;
    symbol: string;
    type?: AssetType;
}
