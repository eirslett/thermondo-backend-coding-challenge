import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { startTestDatabase } from "./testcontainers-setup";
import { PrismaService } from "../src/prisma.service";
import { PrismaClient, User, Movie, Rating } from "@prisma/client";
import { AppModule } from "../src/app.module";
import { Express } from "express";

describe("RatingController (e2e)", () => {
  let app: INestApplication<Express>;
  let prismaService: PrismaService;
  let alice: User;
  let bob: User;
  let movie: Movie;
  let aliceRating: Rating;
  let bobRating: Rating;

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
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    // Clean up and set up test data
    await prismaService.rating.deleteMany();
    await prismaService.user.deleteMany();
    await prismaService.movie.deleteMany();
    alice = await prismaService.user.create({ data: { name: "Alice" } });
    bob = await prismaService.user.create({ data: { name: "Bob" } });
    movie = await prismaService.movie.create({
      data: {
        title: "Test Movie",
        releaseDate: new Date(),
        posterUrl: "url",
        description: "desc",
      },
    });
    aliceRating = await prismaService.rating.create({
      data: {
        movieId: movie.id,
        rating: 3,
        description: "ok",
        userId: alice.id,
      },
    });
    bobRating = await prismaService.rating.create({
      data: {
        movieId: movie.id,
        rating: 2,
        description: "meh",
        userId: bob.id,
      },
    });
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe("/rating (POST)", () => {
    it("should create a rating for the logged-in user", async () => {
      // Create a new movie for Alice to rate
      const newMovie = await prismaService.movie.create({
        data: {
          title: "Another Movie",
          releaseDate: new Date(),
          posterUrl: "url2",
          description: "desc2",
        },
      });
      const dto = { movieId: newMovie.id, rating: 5, description: "Awesome!" };
      const response = await request(app.getHttpServer())
        .post("/rating")
        .send(dto)
        .expect(201);
      expect(response.body).toMatchObject({
        movieId: newMovie.id,
        rating: 5,
        description: "Awesome!",
        userId: alice.id, // Alice is always the logged-in user
      });
    });
  });

  describe("/rating/:id (PATCH)", () => {
    it("should update a rating if owned by the user", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/rating/${aliceRating.id}`)
        .send({ rating: 4, description: "Better" })
        .expect(200);
      expect(response.body).toMatchObject({
        id: aliceRating.id,
        rating: 4,
        description: "Better",
        userId: alice.id,
      });
    });
    it("should forbid update if not owned by the user", async () => {
      await request(app.getHttpServer())
        .patch(`/rating/${bobRating.id}`)
        .send({ rating: 5 })
        .expect(403);
    });
  });

  describe("/rating/:id (DELETE)", () => {
    it("should delete a rating if owned by the user", async () => {
      // Create a new movie and rating for Alice to delete
      const deleteMovie = await prismaService.movie.create({
        data: {
          title: "Delete Movie",
          releaseDate: new Date(),
          posterUrl: "url3",
          description: "desc3",
        },
      });
      const ratingToDelete = await prismaService.rating.create({
        data: {
          movieId: deleteMovie.id,
          rating: 1,
          description: "bad",
          userId: alice.id,
        },
      });
      await request(app.getHttpServer())
        .delete(`/rating/${ratingToDelete.id}`)
        .expect(200);
      const found = await prismaService.rating.findUnique({
        where: { id: ratingToDelete.id },
      });
      expect(found).toBeNull();
    });
    it("should forbid delete if not owned by the user", async () => {
      await request(app.getHttpServer())
        .delete(`/rating/${bobRating.id}`)
        .expect(403);
    });
  });
});
