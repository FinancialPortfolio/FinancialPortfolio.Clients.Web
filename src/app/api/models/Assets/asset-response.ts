import { AssetType } from './asset-type';

export interface AssetResponse {
    id: string;
    name: string;
    symbol: string;
    type: AssetType;
}
