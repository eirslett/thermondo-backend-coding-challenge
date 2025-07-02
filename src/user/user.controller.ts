import {
  Controller,
  Get,
  Req,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { AuthGuard, AuthenticatedRequest } from "../auth/auth.guard";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  async me(@Req() req: AuthenticatedRequest): Promise<User> {
    const { user } = req;

    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }
    const foundUser = await this.userService.findOne(user.id);

    if (!foundUser) {
      throw new NotFoundException("User not found");
    }
    return foundUser;
  }
}
