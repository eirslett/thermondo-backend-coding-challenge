import { Controller, Get, Param } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { Movie } from "./entities/movie.entity";
import { RatingService } from "../rating/rating.service";

@Controller("movie")
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly ratingService: RatingService,
  ) {}

  // TODO:
  // Add endpoint to create/update/delete movies
  // This should probably only be available to admins, using role-based auth

  @Get()
  async findAll(): Promise<Movie[]> {
    // TODO: Add pagination, sorting, filtering, etc.
    return await this.movieService.findAll();
  }

  @Get(":id/ratings")
  async getRatings(@Param("id") id: string) {
    return this.ratingService.findAllByMovieId(+id);
  }
}
