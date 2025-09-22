import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto, AuthResponseDto, RefreshDto } from './dto/auth.dto'
import { Serialize } from '../interceptors/serialize.interceptor'

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Serialize(AuthResponseDto)
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto)
    return { data }
  }

  @Post('login')
  @Serialize(AuthResponseDto)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto)
    return { data }
  }

  @Post('refresh')
  @Serialize(AuthResponseDto)
  async refresh(@Body() refreshDto: RefreshDto) {
    const data = await this.authService.refresh(refreshDto.refreshToken)
    return { data }
  }
}
