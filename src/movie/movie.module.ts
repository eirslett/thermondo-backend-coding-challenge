import { Module } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { PrismaModule } from "../prisma.module";
import { RatingModule } from "../rating/rating.module";

@Module({
  imports: [PrismaModule, RatingModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
