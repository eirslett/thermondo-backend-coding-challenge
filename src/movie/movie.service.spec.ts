import { Test, TestingModule } from "@nestjs/testing";
import { MovieService } from "./movie.service";
import { PrismaService } from "../prisma.service";

describe("MovieService", () => {
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findMany: jest.fn(),
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
});
