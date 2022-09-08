import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DateService {
    ToIsoDate(date: Date): string {
        return new Date(date).toISOString().slice(0, 16);
    }
}
