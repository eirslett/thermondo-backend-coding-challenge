import { Module } from "@nestjs/common";
import { RatingService } from "./rating.service";
import { RatingController } from "./rating.controller";
import { PrismaModule } from "../prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
