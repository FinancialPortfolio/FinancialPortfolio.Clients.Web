import { OrderType } from "src/app/api/models/Orders/order-type";

export function numberOfShares(asset: any): number {
    return asset.orders.reduce((totalShares: number, order: any) => {
        if (order.type == OrderType.Buy) {
            return totalShares + order.amount;
        }

        return totalShares - order.amount;
    }, 0);
}

export function invested(asset: any): number {
    let invested = 0;

    for (let order of asset.orders) {
        if (order.type === OrderType.Buy) {
            invested += order.price * order.amount;
        } else {
            invested -= order.price * order.amount;
        }

        invested += order.commission;
    }

    return invested;
}

export function totalPrice(asset: any): number | null {
    if (asset.assetStatistics == null)
        return null;

    return asset.assetStatistics?.currentPrice * numberOfShares(asset);
}

export function averageSharePrice(asset: any): number {
    return invested(asset) / numberOfShares(asset);
}

export function dividendYieldPerShare(asset: any): number {
    return asset.assetStatistics.currentPrice * asset.assetStatistics.dividendYield / 100;
}

export function unrealizedPL(asset: any): number | null {
    let total = totalPrice(asset);
    if (total === null)
        return null;

    return total - invested(asset);
}

export function unrealizedPLInPercentage(asset: any): number | null {
    let unrealized = unrealizedPL(asset);
    if (unrealized === null)
        return null;

    return unrealized * 100 / invested(asset);
}
