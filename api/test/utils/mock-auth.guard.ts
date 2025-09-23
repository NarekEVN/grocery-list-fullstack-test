import { CanActivate } from '@nestjs/common'

export class MockAuthGuard implements CanActivate {
  canActivate(): boolean {
    return true
  }
}
