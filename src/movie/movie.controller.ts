import { Controller, Get } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { Movie } from "./entities/movie.entity";

@Controller("movie")
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async findAll(): Promise<Movie[]> {
    // TODO: Add pagination, sorting, filtering, etc.
    return await this.movieService.findAll();
  }
}
