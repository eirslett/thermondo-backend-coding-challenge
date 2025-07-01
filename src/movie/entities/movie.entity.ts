import { ApiProperty } from "@nestjs/swagger";

export class Movie {
  @ApiProperty({
    description: "The title of the movie",
    example: "The Dark Knight",
  })
  title: string;

  @ApiProperty({
    description: "The release date of the movie",
    example: "2008-07-18",
  })
  releaseDate: Date;

  @ApiProperty({
    description: "The URL of the movie poster",
    example: "https://example.com/poster.jpg",
  })
  posterUrl: string;

  @ApiProperty({
    description: "The description of the movie",
    example: "A superhero movie about Batman",
  })
  description: string;
}
