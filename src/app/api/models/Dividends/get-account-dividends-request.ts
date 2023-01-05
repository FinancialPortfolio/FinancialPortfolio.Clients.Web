export interface GetAccountDividendsRequest {
    startDateTime: Date;
    endDateTime: Date;
    assetId: string | null;
}
