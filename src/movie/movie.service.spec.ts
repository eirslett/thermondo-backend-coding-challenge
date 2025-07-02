import { Test, TestingModule } from "@nestjs/testing";
import { MovieService } from "./movie.service";
import { PrismaService } from "../prisma.service";

describe("MovieService", () => {
  let service: MovieService;
  let findManyMock: jest.Mock;

  const mockMovies = [
    {
      title: "The Dark Knight",
      releaseDate: new Date("2008-07-18"),
      posterUrl: "https://example.com/poster.jpg",
      description: "A superhero movie about Batman",
    },
    {
      title: "Inception",
      releaseDate: new Date("2010-07-16"),
      posterUrl: "https://example.com/inception.jpg",
      description: "A mind-bending thriller",
    },
  ];

  beforeEach(async () => {
    findManyMock = jest.fn().mockResolvedValue(mockMovies);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findMany: findManyMock,
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all movies", async () => {
    const movies = await service.findAll();
    expect(findManyMock).toHaveBeenCalled();
    expect(movies).toEqual(mockMovies);
  });
});
