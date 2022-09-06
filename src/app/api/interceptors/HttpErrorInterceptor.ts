import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { WebApiProblemDetails } from "../models/Shared/web-api-problem-details";

export class HttpErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((response: HttpErrorResponse) => {
                let error = response.error as WebApiProblemDetails;
                alert(error.title); // TODO: change to toastr

                return throwError(error.title);
            }));
    }
}
