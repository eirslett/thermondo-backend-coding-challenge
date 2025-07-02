import { Test, TestingModule } from "@nestjs/testing";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { Movie } from "./entities/movie.entity";
import { RatingService } from "../rating/rating.service";

describe("MovieController", () => {
  let controller: MovieController;

  const mockMovieService = {
    findAll: jest.fn(),
  };

  const mockRatingService = {
    findAllByMovieId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
        {
          provide: RatingService,
          useValue: mockRatingService,
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

  describe("getRatings", () => {
    it("should return ratings for a given movie", async () => {
      const movieId = 1;
      const expectedRatings = [
        { id: 1, movieId, rating: 5, description: "Great!" },
        { id: 2, movieId, rating: 4, description: "Good!" },
      ];
      mockRatingService.findAllByMovieId.mockResolvedValue(expectedRatings);
      const result = await controller.getRatings(String(movieId));
      expect(mockRatingService.findAllByMovieId).toHaveBeenCalledWith(movieId);
      expect(result).toEqual(expectedRatings);
    });
  });
});
