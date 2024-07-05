import { ChangeDetectionStrategy, Component, Signal, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { Command, CommandPlaceHolder } from './model/command.model';

const Modules = [RouterLink, NzButtonModule, NzIconModule, NzToolTipModule, NzDropDownModule];

@Component({
  selector: 'app-command',
  standalone: true,
  imports: [...Modules],
  templateUrl: './command.component.html',
  styleUrl: './command.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandComponent {
  commands = input<Command[]>([]);
  tableCommands = input<Command<any>[]>([]);
  context = input<any>(null);
  commandPlaceHolder = input<CommandPlaceHolder>(CommandPlaceHolder.Toolbar);
  commandPlaceHolders: typeof CommandPlaceHolder = CommandPlaceHolder;

  visables: Signal<boolean[]> = computed(() => {
    switch (this.commandPlaceHolder()) {
      case CommandPlaceHolder.Toolbar:
        return this.commands().map((command) => command.visible());

      case CommandPlaceHolder.Table:
        return this.tableCommands().map((command) => command.visible(this.context()));

      default:
        return [];
    }
  });
}
