import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)',
  })
  password: string
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class AuthResponseDto {
  @Expose()
  accessToken: string

  @Expose()
  refreshToken: string

  @Expose()
  user: {
    id: string
    email: string
  }
}

export class RefreshDto {
  @IsString()
  refreshToken: string
}
