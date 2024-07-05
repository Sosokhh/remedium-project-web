import { Component, inject, OnInit, signal } from '@angular/core';
// import { CardComponent, Command, CommandComponent } from '@wmis/components';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../core/services';
import { SalesManagerDto } from '../../data-lists';
import { CardComponent } from '../../../components';
import { TranslateModule } from '@ngx-translate/core';

const Modules = [NzTagModule, TranslateModule];
const Components = [CardComponent];
const Pipes = [DatePipe];

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [...Modules, ...Components, ...Pipes],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  #userService = inject(UserService);
  profile = signal<SalesManagerDto | undefined>(undefined);

  ngOnInit(): void {
   this.#userService.getUserInfo().subscribe({
     next: (data: SalesManagerDto) => {
       this.profile.set(data);
     }
   })
  }
}
