import { IsAuthDirective } from './auth.directives';
import { IsSuperAdminDirective } from './authSuperAdmin.directives';

export const schemaDirectives = {
  isAuth: IsAuthDirective,
  isSuperAdmin: IsSuperAdminDirective
}