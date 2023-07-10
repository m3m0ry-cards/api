import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async update(id: number, targets: UpdateUserDto): Promise<void> {
    await this.userRepository.update({ ...targets }, { where: { id: id } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: id },
      include: { all: true },
    });
  }

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { nickname: nickname },
      include: { all: true },
    });
  }
}
