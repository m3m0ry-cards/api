import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TokensDto } from 'src/common/dto/tokens.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensServive: TokensService,
  ) {}

  async signUp(userDto: CreateUserDto): Promise<TokensDto> {
    const candidate = await this.usersService.findByNickname(userDto.nickname);
    if (candidate)
      throw new BadRequestException(
        `Пользователь ${candidate.nickname} уже зарегистрирован`,
      );
    const hashPassword = await this.generateHashForData(userDto.password);
    const user = await this.usersService.create({
      ...userDto,
      password: hashPassword,
    });
    const tokens = await this.getTokens(user);
    await this.tokensServive.createRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }

  async signIn(userDto: CreateUserDto): Promise<TokensDto> {
    const user = await this.validateUser(userDto);
    const tokens = await this.getTokens(user);
    await this.tokensServive.updateRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    return await this.tokensServive.deleteRefreshToken(refreshToken);
  }

  private async getTokens(user: User): Promise<TokensDto> {
    return await this.tokensServive.generateTokens({
      id: user.id,
      nickname: user.nickname,
    });
  }

  private async generateHashForData(data: string): Promise<string> {
    return await bcrypt.hash(data, 5);
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.findByNickname(userDto.nickname);
    if (!user)
      throw new UnauthorizedException({
        message: `Пользователь ${userDto.nickname} в системе не найден`,
      });
    const isPasswordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!isPasswordEquals)
      throw new UnauthorizedException({ message: 'Неверный пароль' });
    return user;
  }
}
