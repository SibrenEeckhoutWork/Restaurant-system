import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CustomerRegisterDto } from './dto/customer-register.dto.js';
import { CustomerLoginDto } from './dto/customer-login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { JwtCustomerGuard } from './guards/jwt-customer.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { JwtPayload } from './strategies/jwt-access.strategy.js';
import type { JwtCustomerPayload } from './strategies/jwt-customer.strategy.js';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // ─── User endpoints ───────────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh user access token via cookie' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = (req.cookies as Record<string, string>)?.['refresh_token'];
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token' });

    const payload = this.authService.verifyRefreshCookie(
      token,
      this.config.getOrThrow('JWT_REFRESH_SECRET'),
    );
    if (!payload) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });

    return this.authService.refresh(payload.sub, token, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(user.sub, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.me(user.sub);
  }

  // ─── Customer endpoints ───────────────────────────────────────────────────────

  @Post('customer/register')
  @ApiOperation({ summary: 'Customer registration' })
  customerRegister(@Body() dto: CustomerRegisterDto) {
    return this.authService.customerRegister(dto);
  }

  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customer login' })
  customerLogin(
    @Body() dto: CustomerLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.customerLogin(dto, res);
  }

  @Post('customer/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh customer access token via cookie' })
  async customerRefresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = (req.cookies as Record<string, string>)?.['customer_refresh_token'];
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token' });

    const payload = this.authService.verifyRefreshCookie(
      token,
      this.config.getOrThrow('JWT_CUSTOMER_REFRESH_SECRET'),
    );
    if (!payload) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });

    return this.authService.customerRefresh(payload.sub, token, res);
  }

  @Post('customer/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Customer logout' })
  customerLogout(
    @Req() req: Request & { user: JwtCustomerPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.customerLogout(req.user.sub, res);
  }

  @Get('customer/me')
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer' })
  customerMe(@Req() req: Request & { user: JwtCustomerPayload }) {
    return this.authService.customerMe(req.user.sub);
  }
}
