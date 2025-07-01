import { Injectable } from "@nestjs/common";
import { Movie } from "./entities/movie.entity";
import { PrismaService } from "../prisma.service";

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Movie[]> {
    // TODO: Add pagination, sorting, filtering, etc.
    const movies = await this.prisma.movie.findMany();
    return movies;
  }
}
