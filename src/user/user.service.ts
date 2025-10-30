import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    return this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  }
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async updateRefreshToken(userId: string, hashedRT: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedRT },
    });
  }

  async findUserPolicies(userId: string) {
    const userPolicies = await this.prisma.userPolicy.findMany({
      where: { userId },
      include: { policy: true },
    });

    return userPolicies.map((up) => up.policy.name);
  }
}
