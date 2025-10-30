import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Role } from '@prisma/client';
import { PoliciesGuard } from '../guards/policies/policies.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard, PoliciesGuard),
  );
}
