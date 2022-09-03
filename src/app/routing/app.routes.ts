import { Routes } from "@angular/router";

import { AuthGuard } from "../authentication/guards/auth.guard";

export const APP_ROUTES: Routes = [
    { path: 'accounts', loadChildren: () => import('../accounts/accounts.module').then(m => m.AccountsModule), canActivate: [AuthGuard] },
    { path: 'transfers', loadChildren: () => import('../transfers/transfers.module').then(m => m.TransfersModule), canActivate: [AuthGuard] },
    { path: 'stocks', loadChildren: () => import('../stocks/stocks.module').then(m => m.StocksModule), canActivate: [AuthGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
