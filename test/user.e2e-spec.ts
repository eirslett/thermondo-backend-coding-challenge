import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { startTestDatabase } from "./testcontainers-setup";
import { PrismaService } from "../src/prisma.service";
import { PrismaClient } from "@prisma/client";
import { AppModule } from "../src/app.module";

describe("UserController (e2e)", () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeAll(async () => {
    // Start the test database first and get the connection string
    const connectionString = await startTestDatabase();

    // Create the testing module with overridden PrismaService
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

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Ensure user 1 (Alice) exists before all tests
    await prismaService.user.upsert({
      where: { id: 1 },
      update: { name: "Alice" },
      create: { id: 1, name: "Alice" },
    });
  }, 30000);

  describe("/user/me (GET)", () => {
    it("should return the current user", async () => {
      const response = await request(app.getHttpServer())
        .get("/user/me")
        .expect(200);

      expect(response.body).toMatchObject({
        id: 1,
        name: "Alice",
      });
    });
  });

  describe("/user/me/ratings (GET)", () => {
    beforeAll(async () => {
      // Create movies and ratings for Alice and Bob
      await prismaService.rating.deleteMany();
      await prismaService.user.upsert({
        where: { id: 2 },
        update: { name: "Bob" },
        create: { id: 2, name: "Bob" },
      });
      const movie1 = await prismaService.movie.create({
        data: {
          title: "Movie 1",
          releaseDate: new Date(),
          posterUrl: "url1",
          description: "desc1",
        },
      });
      const movie2 = await prismaService.movie.create({
        data: {
          title: "Movie 2",
          releaseDate: new Date(),
          posterUrl: "url2",
          description: "desc2",
        },
      });
      await prismaService.rating.create({
        data: {
          movieId: movie1.id,
          rating: 5,
          description: "Alice's rating",
          userId: 1,
        },
      });
      await prismaService.rating.create({
        data: {
          movieId: movie2.id,
          rating: 3,
          description: "Bob's rating",
          userId: 2,
        },
      });
    });

    it("should return only ratings for the current user (Alice)", async () => {
      const response = await request(app.getHttpServer())
        .get("/user/me/ratings")
        .expect(200);
      const ratings = response.body as Array<{
        userId: number;
        description: string;
      }>;
      expect(Array.isArray(ratings)).toBe(true);
      expect(ratings.length).toBe(1);
      expect(ratings[0]).toMatchObject({
        userId: 1,
        description: "Alice's rating",
      });
    });
  });
});
