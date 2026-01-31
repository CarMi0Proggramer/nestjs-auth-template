import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams } from './types/create-user-params';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserParams: CreateUserParams) {
    const user = this.userRepository.create(createUserParams);
    return await this.userRepository.save(user);
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    return await this.userRepository.update(userId, { hashedRefreshToken });
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name'],
    });

    if (!user) throw new NotFoundException('O usuário não foi encontrado');

    return user;
  }
}
