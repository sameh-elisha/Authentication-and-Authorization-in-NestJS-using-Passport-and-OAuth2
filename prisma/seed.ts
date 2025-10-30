import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // 🧹 Clean old data
  await prisma.userPolicy.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.user.deleteMany();

  // 👤 Create Users (await the hash)
  const samehPassword = await hash('123456'); // or any test password
  const peterPassword = await hash('123456');

  const sameh = await prisma.user.create({
    data: {
      name: 'Sameh',
      email: 'sameh@example.com',
      password: samehPassword,
      role: Role.ADMIN,
    },
  });

  const peter = await prisma.user.create({
    data: {
      name: 'Peter',
      email: 'peter@example.com',
      password: peterPassword,
      role: Role.ADMIN,
    },
  });

  // 🧩 Create Policies
  const canRead = await prisma.policy.create({
    data: { name: 'can_read_users', description: 'Can view users list' },
  });

  const canDelete = await prisma.policy.create({
    data: { name: 'can_delete_users', description: 'Can delete users' },
  });

  const canCreate = await prisma.policy.create({
    data: { name: 'can_create_users', description: 'Can create new users' },
  });

  // 🔗 Assign policies
  await prisma.userPolicy.createMany({
    data: [
      // Sameh: delete + create
      { userId: sameh.id, policyId: canDelete.id },
      { userId: sameh.id, policyId: canCreate.id },

      // Peter: read only
      { userId: peter.id, policyId: canRead.id },
    ],
  });

  console.log('✅ Seed complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
