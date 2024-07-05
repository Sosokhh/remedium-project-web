import { CommonModule, Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(private location: Location, private router: Router) {}

  top: number = 0;
  left: number = 0;
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.top = event.pageY;
    this.left = event.pageX;
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigateByUrl('/main');
  }
}
