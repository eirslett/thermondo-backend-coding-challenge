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
import { RatingService } from "../rating/rating.service";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ratingService: RatingService,
  ) {}

  // TODO:
  // - Endpoint to create a new user: possible with admin-only role access,
  //   integration with signup/login/etc.
  // - Create a new endpoint to get "all" info about the user at once:
  //   (name, email, profile picture, bio, ratings, etc.)
  // - Endpoint to change user info: name, email, profile picture, bio

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

  @Get("me/ratings")
  async myRatings(@Req() req: AuthenticatedRequest) {
    const { user } = req;
    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }
    return this.ratingService.findAllByUserId(user.id);
  }
}
