import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma.module";
import { RatingModule } from "../rating/rating.module";
import { RatingService } from "../rating/rating.service";

@Module({
  imports: [PrismaModule, RatingModule],
  controllers: [UserController],
  providers: [UserService, RatingService],
})
export class UserModule {}
