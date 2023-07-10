import { Module } from '@nestjs/common';
import { Token } from './tokens.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  providers: [TokensService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [JwtModule.register({}), SequelizeModule.forFeature([Token])],
  exports: [TokensService],
})
export class TokensModule {}
