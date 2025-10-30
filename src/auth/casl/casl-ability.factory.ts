// import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
// import { Injectable } from '@nestjs/common';
// import { User } from '@prisma/client';

// export type AppAbility = Ability<[string, string]>;

// @Injectable()
// export class CaslAbilityFactory {
//   createForUser(user: User) {
//     const { can, cannot, build } = new AbilityBuilder<Ability<[string, string]>>(
//       Ability as AbilityClass<AppAbility>,
//     );

//     // Example: assign policies based on role
//     if (user.role === 'ADMIN') {
//       can('can_manage_all', 'all');
//       can('can_read_users', 'all');
//       can('can_update_users', 'all');
//       can('can_delete_users', 'all');
//     } else if (user.role === 'USER') {
//       can('can_read_users', 'all');
//     }

//     return build();
//   }
// }
