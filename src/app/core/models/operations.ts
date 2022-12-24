import { FailedOperation } from "./failed-operation";
import { SuccessfulOperation } from "./successful-operation";

// Events
export const AccountCreatedOperation = "AccountCreatedEvent";
export const AccountUpdatedOperation = "AccountUpdatedEvent";
export const AccountDeletedOperation = "AccountDeletedEvent";

export const TransferCreatedOperation = "TransferCreatedEvent";
export const TransfersIntegratedOperation = "TransfersIntegratedEvent";
export const TransferUpdatedOperation = "TransferUpdatedEvent";
export const TransferDeletedOperation = "TransferDeletedEvent";

export const OrderCreatedOperation = "OrderCreatedEvent";
export const OrdersIntegratedOperation = "OrdersIntegratedEvent";
export const OrderUpdatedOperation = "OrderUpdatedEvent";
export const OrderDeletedOperation = "OrderDeletedEvent";

export const AssetsUpdatedOperation = "AssetsUpdatedEvent";

export const CategoryUpdatedOperation = "CategoryUpdatedOperation";


// Commands
export const CreateAccountOperation = "CreateAccountCommand";
export const UpdateAccountOperation = "UpdateAccountCommand";
export const DeleteAccountOperation = "DeleteAccountCommand";

export const CreateTransferOperation = "CreateTransferCommand";
export const IntegrateTransfersOperation = "IntegrateTransfersCommand";
export const UpdateTransferOperation = "UpdateTransferCommand";
export const DeleteTransferOperation = "DeleteTransferCommand";

export const CreateOrderOperation = "CreateOrderCommand";
export const IntegrateOrdersOperation = "IntegrateOrdersCommand";
export const UpdateOrderOperation = "UpdateOrderCommand";
export const DeleteOrderOperation = "DeleteOrderCommand";

export const FetchAssetStatisticsOperation = "FetchAssetStatisticsCommand";


export function getSuccessfulMessage(operation: SuccessfulOperation): string | null {
    switch (operation.name) {
        case AccountCreatedOperation: return "Account was created successfully.";
        case AccountUpdatedOperation: return "Account was updated successfully.";
        case AccountDeletedOperation: return "Account was deleted successfully.";

        case TransferCreatedOperation: return "Transfer was created successfully.";
        case TransfersIntegratedOperation: return "Transfers were integrated successfully.";
        case TransferUpdatedOperation: return "Transfer was updated successfully.";
        case TransferDeletedOperation: return "Transfer was deleted successfully.";

        case OrderCreatedOperation: return "Order was created successfully.";
        case OrdersIntegratedOperation: return "Orders were integrated successfully.";
        case OrderUpdatedOperation: return "Order was updated successfully.";
        case OrderDeletedOperation: return "Order was deleted successfully.";

        case CategoryUpdatedOperation: return "Category was updated successfully.";

        default:
            return null;
    }
}

export function getFailedMessage(operation: FailedOperation): string {
    switch (operation.name) {
        case CreateAccountOperation: return "Account wasn't created.";
        case UpdateAccountOperation: return "Account wasn't updated.";
        case DeleteAccountOperation: return "Account wasn't deleted.";

        case CreateTransferOperation: return "Transfer wasn't created.";
        case IntegrateTransfersOperation: return "Transfers weren't integrated.";
        case UpdateTransferOperation: return "Transfer wasn't updated.";
        case DeleteTransferOperation: return "Transfer wasn't deleted.";

        case CreateOrderOperation: return "Order wasn't created.";
        case IntegrateOrdersOperation: return "Orders weren't integrated.";
        case UpdateOrderOperation: return "Order wasn't updated.";
        case DeleteOrderOperation: return "Order wasn't deleted.";

        case FetchAssetStatisticsOperation: return "Asset statistics wasn't updated.";

        case OrderUpdatedOperation: return "Category wasn't updated.";

        default:
            throw new Error(`Message for ${operation.name} is not defined.`)
    }
}
