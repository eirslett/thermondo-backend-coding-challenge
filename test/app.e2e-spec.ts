import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { startTestDatabase } from "./testcontainers-setup";
import { PrismaService } from "../src/prisma.service";
import { PrismaClient } from "@prisma/client";
import { AppModule } from "../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
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
  }, 30000);

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });
});
