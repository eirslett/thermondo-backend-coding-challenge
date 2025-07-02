import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
// import { User } from "../user/entities/user.entity";
import { Request as ExpressRequest } from "express";

export interface AuthenticatedRequest extends ExpressRequest {
  user?: { id: number };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    // TODO: Implement actual auth logic
    request["user"] = {
      id: 1,
    };

    return true;
  }
}
