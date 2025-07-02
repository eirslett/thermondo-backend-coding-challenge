import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { startTestDatabase, cleanupTestDatabase } from "./testcontainers-setup";
import { PrismaService } from "../src/prisma.service";
import { PrismaClient } from "@prisma/client";
import { AppModule } from "../src/app.module";

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  posterUrl: string;
  description: string;
}

describe("MovieController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const connectionString = await startTestDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useFactory({
        factory: () => {
          const prisma = new PrismaClient({
            datasources: {
              db: { url: connectionString },
            },
          });
          return prisma;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get the PrismaService instance
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/movie (GET)", () => {
    it("should return an empty array when no movies exist", () => {
      return request(app.getHttpServer()).get("/movie").expect(200).expect([]);
    });

    it("should return all movies when movies exist", async () => {
      // Create test movies in the database
      const testMovies = [
        {
          title: "The Dark Knight",
          releaseDate: new Date("2008-07-18"),
          posterUrl: "https://example.com/dark-knight.jpg",
          description: "A superhero movie about Batman",
        },
        {
          title: "Inception",
          releaseDate: new Date("2010-07-16"),
          posterUrl: "https://example.com/inception.jpg",
          description: "A mind-bending thriller about dreams",
        },
        {
          title: "Interstellar",
          releaseDate: new Date("2014-11-07"),
          posterUrl: "https://example.com/interstellar.jpg",
          description: "A space exploration epic",
        },
      ];

      // Insert movies into the database
      await Promise.all(
        testMovies.map((movie) =>
          prismaService.movie.create({
            data: movie,
          }),
        ),
      );

      // Test the API endpoint
      const response = await request(app.getHttpServer())
        .get("/movie")
        .expect(200);

      // Verify the response
      const movies = response.body as Movie[];
      expect(movies).toHaveLength(3);

      // Check each movie individually with proper type expectations
      const darkKnight = movies.find((m) => m.title === "The Dark Knight");
      expect(darkKnight).toBeDefined();
      expect(darkKnight?.title).toBe("The Dark Knight");
      expect(darkKnight?.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}/); // ISO date format
      expect(darkKnight?.posterUrl).toBe("https://example.com/dark-knight.jpg");
      expect(darkKnight?.description).toBe("A superhero movie about Batman");
      expect(typeof darkKnight?.id).toBe("number");

      const inception = movies.find((m) => m.title === "Inception");
      expect(inception).toBeDefined();
      expect(inception?.title).toBe("Inception");
      expect(inception?.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(inception?.posterUrl).toBe("https://example.com/inception.jpg");
      expect(inception?.description).toBe(
        "A mind-bending thriller about dreams",
      );
      expect(typeof inception?.id).toBe("number");

      const interstellar = movies.find((m) => m.title === "Interstellar");
      expect(interstellar).toBeDefined();
      expect(interstellar?.title).toBe("Interstellar");
      expect(interstellar?.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(interstellar?.posterUrl).toBe(
        "https://example.com/interstellar.jpg",
      );
      expect(interstellar?.description).toBe("A space exploration epic");
      expect(typeof interstellar?.id).toBe("number");

      // Verify that the returned movies have numeric IDs
      movies.forEach((movie: Movie) => {
        expect(typeof movie.id).toBe("number");
        expect(movie.id).toBeGreaterThan(0);
      });
    });
  });
});
