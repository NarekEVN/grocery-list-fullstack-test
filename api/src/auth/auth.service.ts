import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto, LoginDto } from './dto/auth.dto'
import type { JwtPayload } from './strategies/jwt.strategy'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto

    const existingUser = await this.prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true },
    })

    const payload: JwtPayload = { sub: user.id, email: user.email }
    const tokens = this.generateTokens(payload)

    return { ...tokens, user }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
    }

    const payload: JwtPayload = { sub: user.id, email: user.email }
    const tokens = this.generateTokens(payload)

    return {
      ...tokens,
      user: { id: user.id, email: user.email },
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      })

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true },
      })
      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      const newTokens = this.generateTokens({ sub: user.id, email: user.email })
      return { ...newTokens, user }
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  private generateTokens(payload: JwtPayload) {
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    })

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1h',
    })

    return { access_token, refresh_token }
  }
}
