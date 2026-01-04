import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class LayoutComponent {

}
