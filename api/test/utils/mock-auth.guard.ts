import { CanActivate, ExecutionContext } from '@nestjs/common'

export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    request.user = {
      id: '7f21c221-363c-41b0-9b11-319d9c12dc34',
      email: 'test@example.com',
    }
    return true
  }
}
