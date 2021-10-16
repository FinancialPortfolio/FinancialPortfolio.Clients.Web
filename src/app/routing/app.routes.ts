import { Routes } from "@angular/router";

import { AuthGuard } from "../authentication/guards/auth.guard";

export const APP_ROUTES: Routes = [
    { path: 'accounts', loadChildren: () => import('../accounts/accounts.module').then(m => m.AccountsModule), canActivate: [AuthGuard]},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
