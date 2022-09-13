import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { NotificationService } from "src/app/core/services/notification.service";
import { WebApiProblemDetails } from "../models/Shared/web-api-problem-details";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private notificationService: NotificationService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((response: HttpErrorResponse) => {
                let error = response.error as WebApiProblemDetails;
                this.notificationService.error(error.statusCode, error.title);

                return throwError(error.title);
            }));
    }
}
