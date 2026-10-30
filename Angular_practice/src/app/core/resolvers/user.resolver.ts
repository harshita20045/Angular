import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models';

export const userResolver: ResolveFn<User | undefined> = async (
  route: ActivatedRouteSnapshot
) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id');
  if (!id) return undefined;
  return await userService.getById(id);
};
