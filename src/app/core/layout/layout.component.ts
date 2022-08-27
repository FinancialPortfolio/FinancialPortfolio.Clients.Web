import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    animations: [
        trigger(
            'headerAnimation', [
            transition(':enter', [
                style({ height: 0, opacity: 0, padding: 0 }),
                animate('500ms', style({ opacity: 1, height: '64px' }))
            ]),
            transition(':leave', [
                style({ opacity: 1, height: '64px' }),
                animate('500ms', style({ height: 0, opacity: 0, padding: 0 }))
            ])
        ]
        )
    ],
})
export class LayoutComponent {
    @ViewChild(MatSidenav) sidenav!: MatSidenav;

    constructor(private observer: BreakpointObserver) { }

    ngAfterViewInit() {
        this.observer
            .observe(['(max-width: 800px)'])
            .pipe(delay(1))
            .subscribe((res) => {
                if (res.matches) {
                    this.openSidebar();
                } else {
                    this.closeSidebar();
                }
            });
    }

    closeSidebar() {
        this.sidenav.mode = 'over';
        this.sidenav.close();
    }

    openSidebar() {
        this.sidenav.mode = 'side';
        this.sidenav.open();
    }
}
