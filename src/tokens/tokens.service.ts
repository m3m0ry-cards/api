import { Injectable } from '@nestjs/common';
import { Token } from './tokens.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { TokensDto } from 'src/common/dto/tokens.dto';

type UserData = {
  id: number;
  nickname: string;
};

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token) private tokenRepository: typeof Token,
    private jwtService: JwtService,
  ) {}

  async createRefreshToken(dto: CreateRefreshTokenDto): Promise<Token> {
    const token = await this.tokenRepository.create(dto);
    return token;
  }

  async updateRefreshToken(dto: CreateRefreshTokenDto): Promise<void> {
    await this.tokenRepository.update(
      { refreshToken: dto.refreshToken },
      { where: { userId: dto.userId } },
    );
  }

  async deleteRefreshToken(
    refreshToken: TokensDto['refreshToken'],
  ): Promise<void> {
    await this.tokenRepository.destroy({
      where: { refreshToken: refreshToken },
    });
  }

  async generateTokens(userData: UserData): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userData.id, nickname: userData.nickname },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userData.id, nickname: userData.nickname },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30m' },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
