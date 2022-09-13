import { FailedOperation } from "./failed-operation";
import { SuccessfulOperation } from "./successful-operation";

// Events
export const AccountCreatedOperation = "AccountCreatedEvent";
export const AccountUpdatedOperation = "AccountUpdatedEvent";
export const AccountDeletedOperation = "AccountDeletedEvent";

export const TransferCreatedOperation = "TransferCreatedEvent";
export const TransferUpdatedOperation = "TransferUpdatedEvent";
export const TransferDeletedOperation = "TransferDeletedEvent";

export const OrderCreatedOperation = "OrderCreatedEvent";
export const OrderUpdatedOperation = "OrderUpdatedEvent";
export const OrderDeletedOperation = "OrderDeletedEvent";


// Commands
export const CreateAccountOperation = "CreateAccountCommand";
export const UpdateAccountOperation = "UpdateAccountCommand";
export const DeleteAccountOperation = "DeleteAccountCommand";

export const CreateTransferOperation = "CreateTransferCommand";
export const UpdateTransferOperation = "UpdateTransferCommand";
export const DeleteTransferOperation = "DeleteTransferCommand";

export const CreateOrderOperation = "CreateOrderCommand";
export const UpdateOrderOperation = "UpdateOrderCommand";
export const DeleteOrderOperation = "DeleteOrderCommand";


export function getSuccessfulMessage(operation: SuccessfulOperation): string {
    switch (operation.name) {
        case AccountCreatedOperation: return "Account was created successfully.";
        case AccountUpdatedOperation: return "Account was updated successfully.";
        case AccountDeletedOperation: return "Account was deleted successfully.";

        case TransferCreatedOperation: return "Transfer was created successfully.";
        case TransferUpdatedOperation: return "Transfer was updated successfully.";
        case TransferDeletedOperation: return "Transfer was deleted successfully.";

        case OrderCreatedOperation: return "Order was created successfully.";
        case OrderUpdatedOperation: return "Order was updated successfully.";
        case OrderDeletedOperation: return "Order was deleted successfully.";

        default:
            throw new Error(`Message for ${operation.name} is not defined.`)
    }
}

export function getFailedMessage(operation: FailedOperation): string {
    switch (operation.name) {
        case CreateAccountOperation: return "Account wasn't created.";
        case UpdateAccountOperation: return "Account wasn't updated.";
        case DeleteAccountOperation: return "Account wasn't deleted.";

        case CreateTransferOperation: return "Transfer wasn't created.";
        case UpdateTransferOperation: return "Transfer wasn't updated.";
        case DeleteTransferOperation: return "Transfer wasn't deleted.";

        case CreateOrderOperation: return "Order wasn't created.";
        case UpdateOrderOperation: return "Order wasn't updated.";
        case DeleteOrderOperation: return "Order wasn't deleted.";

        default:
            throw new Error(`Message for ${operation.name} is not defined.`)
    }
}
