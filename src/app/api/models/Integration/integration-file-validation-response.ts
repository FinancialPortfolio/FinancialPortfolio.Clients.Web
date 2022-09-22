import { InvalidOrderResponse } from "./invalid-order-response";

export interface IntegrationFileValidationResponse {
    invalidOrders: InvalidOrderResponse[];
}
