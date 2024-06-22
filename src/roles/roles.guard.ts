import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Roles } from './roles.enum';

@Injectable()
export class TokenExtractor {
  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class PayloadVerifier {
  constructor(private jwtService: JwtService) {}

  async verifyPayload(token: string, requiredRoles: Roles[]): Promise<any> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    if (!payload || !requiredRoles.includes(payload.role)) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenExtractor: TokenExtractor,
    private payloadVerifier: PayloadVerifier,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.tokenExtractor.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.payloadVerifier.verifyPayload(
      token,
      requiredRoles,
    );
    request['user'] = payload;
    return true;
  }
}
