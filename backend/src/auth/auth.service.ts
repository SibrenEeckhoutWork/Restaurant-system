import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from '../users/users.service.js';
import { CustomersService } from '../customers/customers.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CustomerLoginDto } from './dto/customer-login.dto.js';
import { CustomerRegisterDto } from './dto/customer-register.dto.js';
import { User } from '../users/user.entity.js';
import { Customer } from '../customers/customer.entity.js';

const REFRESH_COOKIE = 'refresh_token';
const CUSTOMER_REFRESH_COOKIE = 'customer_refresh_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── User Auth ───────────────────────────────────────────────────────────────

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueUserTokens(user, res);
  }

  async refresh(userId: string, incomingToken: string, res: Response) {
    const user = await this.usersService.findById(userId);
    if (!user?.refreshTokenHash) throw new UnauthorizedException();

    const match = await bcrypt.compare(incomingToken, user.refreshTokenHash);
    if (!match) throw new UnauthorizedException();

    return this.issueUserTokens(user, res);
  }

  async logout(userId: string, res: Response): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
    res.clearCookie(REFRESH_COOKIE);
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    const { password, refreshTokenHash, ...safe } = user;
    void password; void refreshTokenHash;
    return safe;
  }

  private async issueUserTokens(user: User, res: Response) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'user' },
      {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d'),
      },
    );

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hash);

    const isProduction = this.config.get('NODE_ENV') === 'production';
    res.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
    });

    return { accessToken };
  }

  // ─── Customer Auth ────────────────────────────────────────────────────────────

  async customerRegister(dto: CustomerRegisterDto) {
    const existing = await this.customersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');
    const customer = await this.customersService.create(dto);
    const { password, refreshTokenHash, ...safe } = customer;
    void password; void refreshTokenHash;
    return safe;
  }

  async customerLogin(dto: CustomerLoginDto, res: Response) {
    const customer = await this.customersService.findByEmail(dto.email);
    if (!customer) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, customer.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueCustomerTokens(customer, res);
  }

  async customerRefresh(customerId: string, incomingToken: string, res: Response) {
    const customer = await this.customersService.findById(customerId);
    if (!customer?.refreshTokenHash) throw new UnauthorizedException();

    const match = await bcrypt.compare(incomingToken, customer.refreshTokenHash);
    if (!match) throw new UnauthorizedException();

    return this.issueCustomerTokens(customer, res);
  }

  async customerLogout(customerId: string, res: Response): Promise<void> {
    await this.customersService.updateRefreshToken(customerId, null);
    res.clearCookie(CUSTOMER_REFRESH_COOKIE);
  }

  async customerMe(customerId: string) {
    const customer = await this.customersService.findById(customerId);
    if (!customer) throw new UnauthorizedException();
    const { password, refreshTokenHash, ...safe } = customer;
    void password; void refreshTokenHash;
    return safe;
  }

  private async issueCustomerTokens(customer: Customer, res: Response) {
    const accessToken = this.jwtService.sign(
      { sub: customer.id, email: customer.email, type: 'customer' },
      {
        secret: this.config.getOrThrow('JWT_CUSTOMER_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: customer.id, type: 'customer-refresh' },
      {
        secret: this.config.getOrThrow('JWT_CUSTOMER_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d'),
      },
    );

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.customersService.updateRefreshToken(customer.id, hash);

    const isProduction = this.config.get('NODE_ENV') === 'production';
    res.cookie(CUSTOMER_REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
    });

    return { accessToken };
  }

  // ─── Shared ───────────────────────────────────────────────────────────────────

  verifyRefreshCookie(
    cookieValue: string,
    secret: string,
  ): { sub: string } | null {
    try {
      return this.jwtService.verify<{ sub: string }>(cookieValue, { secret });
    } catch {
      return null;
    }
  }
}
