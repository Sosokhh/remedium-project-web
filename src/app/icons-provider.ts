import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  MailOutline,
  LockOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  HomeOutline,
  LogoutOutline,
  TableOutline,
  SnippetsOutline,
  FileSearchOutline,
  SettingOutline,
  UserOutline,
  EyeInvisibleOutline,
  ShoppingCartOutline
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  MailOutline,
  LockOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  HomeOutline,
  LogoutOutline,
  TableOutline,
  SnippetsOutline,
  FileSearchOutline,
  SettingOutline,
  UserOutline,
  EyeInvisibleOutline,
  ShoppingCartOutline,
];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
