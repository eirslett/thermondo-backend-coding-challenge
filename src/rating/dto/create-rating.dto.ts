import { IsNumber, IsString } from "class-validator";

export class CreateRatingDto {
  @IsNumber()
  movieId: number;

  @IsNumber()
  rating: number;

  @IsString()
  description: string;
}
