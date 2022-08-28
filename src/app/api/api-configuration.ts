import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ApiConfiguration {
    rootUrl: string = '';
}

export interface ApiConfigurationParams {
    rootUrl: string;
}
