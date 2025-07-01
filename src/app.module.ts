import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MovieModule } from "./movie/movie.module";
import { UserModule } from "./user/user.module";
import { RatingModule } from "./rating/rating.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot(), MovieModule, UserModule, RatingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
