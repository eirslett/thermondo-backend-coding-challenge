import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class CreateMovieDto {
  @ApiProperty({
    description: "The title of the movie",
    example: "The Dark Knight",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "The release date of the movie",
    example: "2008-07-18",
  })
  @IsDate()
  releaseDate: Date;

  @ApiProperty({
    description: "The URL of the movie poster",
    example: "https://example.com/poster.jpg",
  })
  @IsString()
  posterUrl: string;

  @ApiProperty({
    description: "The description of the movie",
    example: "A superhero movie about Batman",
  })
  @IsString()
  description: string;
}
