import { Routes } from "@angular/router";

import { AuthGuard } from "../authentication/guards/auth.guard";

export const APP_ROUTES: Routes = [
    { path: 'accounts', loadChildren: () => import('../features/accounts/accounts.module').then(m => m.AccountsModule), canActivate: [AuthGuard] },
    { path: 'transfers', loadChildren: () => import('../features/transfers/transfers.module').then(m => m.TransfersModule), canActivate: [AuthGuard] },
    { path: 'stocks', loadChildren: () => import('../features/stocks/stocks.module').then(m => m.StocksModule), canActivate: [AuthGuard] },
    { path: 'orders', loadChildren: () => import('../features/orders/orders.module').then(m => m.OrdersModule), canActivate: [AuthGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
