import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private toastr: ToastrService, private dialog: MatDialog) {
    }

    error(title: string, message: string): void {
        this.toastr.error(message, title);
    }

    success(message: string): void {
        this.toastr.success(message);
    }

    confirm(title: string, message: string): Observable<boolean> {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { title, message }
        });

        return dialogRef.afterClosed();
    }
}
