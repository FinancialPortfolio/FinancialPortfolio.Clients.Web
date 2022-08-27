/* tslint:disable */
/* eslint-disable */
import { TransferType as FinancialPortfolioApiGatewayContractsEquityEnumsTransferType } from '../../../../../FinancialPortfolio/APIGateway/Contracts/Equity/Enums/transfer-type';
export interface CreateTransferRequest {
    accountId?: string;
    amount?: number;
    dateTime?: null | string;
    type?: FinancialPortfolioApiGatewayContractsEquityEnumsTransferType;
}
