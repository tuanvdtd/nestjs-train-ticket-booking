import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from './user.service';
import { REQUIRED_PERMISSIONs_KEY } from 'src/common/rbac-decorator';

@Injectable()
export class RbacGuard implements CanActivate {

  @Inject(UserService)
  private userService: UserService;
  @Inject()
  private reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const req : Request = context.switchToHttp().getRequest();
    // Nếu không có requiredPermissions thì cho qua luôn
    const requiredPermissions = this.reflector.getAllAndOverride(REQUIRED_PERMISSIONs_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // if (!req['user']) {
    //   return true;
    // }

    const username = req['user'].userId;
    const userPermissions = await this.userService.findUserAndPermissionById(+username);
    if (!userPermissions || userPermissions.length === 0) {
      throw new UnauthorizedException('No permissions');
    }
    console.log("rbac guard ...")
    console.log(userPermissions);
    // console.log("roles", userPermissions?.roles)
    // console.log("permissions", userPermissions?.roles.map(role => role.permissions));

    // Kiểm tra xem user có toàn bộ quyền trong requiredPermissions không
    const canAccess = requiredPermissions.every(permission => userPermissions.includes(permission));
    if (!canAccess) {
      throw new UnauthorizedException('No permissions');
    }
    return true;
  }
}
