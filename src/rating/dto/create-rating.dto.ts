import { IsNumber, IsString, Min, Max } from "class-validator";

export class CreateRatingDto {
  @IsNumber()
  movieId: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @IsString()
  description: string;
}
