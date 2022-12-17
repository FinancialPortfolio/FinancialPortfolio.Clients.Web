import { Routes } from "@angular/router";

import { AuthGuard } from "../authentication/guards/auth.guard";

export const APP_ROUTES: Routes = [
    { path: 'accounts', loadChildren: () => import('../features/accounts/accounts.module').then(m => m.AccountsModule), canActivate: [AuthGuard] },
    { path: 'categories', loadChildren: () => import('../features/categories/categories.module').then(m => m.CategoriesModule), canActivate: [AuthGuard] },
    { path: 'transfers', loadChildren: () => import('../features/transfers/transfers.module').then(m => m.TransfersModule), canActivate: [AuthGuard] },
    { path: 'assets', loadChildren: () => import('../features/assets/assets.module').then(m => m.AssetsModule), canActivate: [AuthGuard] },
    { path: 'account-assets', loadChildren: () => import('../features/account-assets/account-assets.module').then(m => m.AccountAssetsModule), canActivate: [AuthGuard] },
    { path: 'orders', loadChildren: () => import('../features/orders/orders.module').then(m => m.OrdersModule), canActivate: [AuthGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
