import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { POLICIES_KEY } from '../../decorators/policies.decorator';
import { UserService } from '../../../user/user.service';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPolicies = this.reflector.getAllAndOverride<string[]>(
      POLICIES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPolicies || requiredPolicies.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    const userPolicyNames = await this.userService.findUserPolicies(user.id);
    console.log('User Policies:', userPolicyNames);
    const hasAll = requiredPolicies.every((policy) =>
      userPolicyNames.includes(policy),
    );
    console.log('Has all required policies:', hasAll);
    if (!hasAll) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
