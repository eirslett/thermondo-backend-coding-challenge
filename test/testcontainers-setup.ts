import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

let container: PostgreSqlContainer | null = null;
let startedContainer: StartedPostgreSqlContainer | null = null;
let connectionString: string | null = null;

export async function startTestDatabase(): Promise<string> {
  if (startedContainer && connectionString) {
    return connectionString;
  }

  container = new PostgreSqlContainer("postgres:15")
    .withDatabase("testdb")
    .withUsername("testuser")
    .withPassword("testpass");

  startedContainer = await container.start();
  connectionString = startedContainer.getConnectionUri();

  // Run migrations
  execSync("npx prisma db push", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: connectionString },
  });

  return connectionString;
}

export async function cleanupTestDatabase(): Promise<void> {
  if (!connectionString) return;

  const prisma = new PrismaClient({
    datasources: { db: { url: connectionString } },
  });

  try {
    await prisma.rating.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();
  } finally {
    await prisma.$disconnect();
  }
}

export async function stopTestDatabase(): Promise<void> {
  if (startedContainer) {
    try {
      await startedContainer.stop();
    } catch {
      // Ignore errors when stopping container
    }
    container = null;
    startedContainer = null;
    connectionString = null;
  }
}
