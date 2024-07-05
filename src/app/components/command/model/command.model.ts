import { NzButtonType } from 'ng-zorro-antd/button';

export interface CommandBase {
  icon: string;
  isLink: boolean;
  iconButtonType?: NzButtonType;
  tooltipTitle?: string;
  tooltipPlacement?: TooltipPlacement;
}

export type Command<T = undefined> =
  | (CommandBase & { isLink: true; routerLink: string; visible: () => boolean })
  | (CommandBase &
      (T extends undefined
        ? { isLink: false; action: () => void; visible: () => boolean }
        : { isLink: false; action: (x: T) => void; visible: (x: T) => boolean }));

export enum CommandPlaceHolder {
  Table,
  Toolbar,
}

export type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom'
  | Array<string>;
