import { Test, TestingModule } from "@nestjs/testing";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { Movie } from "./entities/movie.entity";

describe("MovieController", () => {
  let controller: MovieController;

  const mockMovieService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of movies", async () => {
      const expectedMovies: Movie[] = [
        {
          title: "Casablanca",
          releaseDate: new Date("1942-11-26"),
          posterUrl: "https://example.com/casablanca.jpg",
          description:
            "A cynical American expatriate meets a former lover in Morocco during WWII",
        },
        {
          title: "Gone with the Wind",
          releaseDate: new Date("1939-12-15"),
          posterUrl: "https://example.com/gone-with-the-wind.jpg",
          description:
            "An epic historical romance set against the backdrop of the American Civil War",
        },
      ];

      mockMovieService.findAll.mockResolvedValue(expectedMovies);

      const result = await controller.findAll();

      expect(mockMovieService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedMovies);
    });
  });
});
