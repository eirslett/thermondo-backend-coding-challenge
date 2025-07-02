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
  }, 15000);

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
});
