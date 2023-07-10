import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { TokensDto } from 'src/common/dto/tokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  singUp(
    @Res({ passthrough: true }) res: Response,
    @Body() userDto: CreateUserDto,
  ): Promise<TokensDto> {
    const tokens = this.authService.signUp(userDto);
    tokens.then((tokens) => {
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    });
    return tokens;
  }

  @Post('/signin')
  signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() userDto: CreateUserDto,
  ): Promise<TokensDto> {
    const tokens = this.authService.signIn(userDto);
    tokens.then((tokens) => {
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    });
    return tokens;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  logout(
    @Res({ passthrough: true }) res: Response,
    @Body() refreshToken: string,
  ) {
    res.clearCookie('refreshToken');
    return this.authService.logout(refreshToken);
  }
}
