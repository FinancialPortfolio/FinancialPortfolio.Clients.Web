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
    return averageSharePrice(asset) * numberOfShares(asset);
}

export function totalPrice(asset: any): number | null {
    if (asset.assetStatistics == null)
        return null;

    return asset.assetStatistics?.currentPrice * numberOfShares(asset);
}

export function averageSharePrice(asset: any): number {
    let averagePrice = 0;
    let numberOfShares = 0;

    for (let order of asset.orders) {
        if (order.type === OrderType.Buy) {
            averagePrice = (averagePrice * numberOfShares + order.price * order.amount) / (numberOfShares + order.amount);
            numberOfShares += order.amount;
        } else {
            numberOfShares -= order.amount;
        }
    }

    return averagePrice;
}
