import { AssetType } from './asset-type';

export interface AssetResponse {
    id: string;
    symbol: string;
    name: string;
    type: AssetType;
}
