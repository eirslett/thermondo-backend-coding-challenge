import { Test, TestingModule } from "@nestjs/testing";
import { RatingService } from "./rating.service";
import { PrismaService } from "../prisma.service";
import { NotFoundException, ForbiddenException } from "@nestjs/common";

describe("RatingService", () => {
  let service: RatingService;

  const prismaMock = {
    rating: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    // Clear all mocks before each test
    Object.values(prismaMock.rating).forEach((fn) => fn.mockClear());
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get<RatingService>(RatingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a rating with userId", async () => {
      prismaMock.rating.create.mockResolvedValue({ id: 1, userId: 1 });
      const dto = { movieId: 1, rating: 5, description: "Great!" };
      const result = await service.create(dto, 1);
      expect(prismaMock.rating.create).toHaveBeenCalledWith({
        data: { ...dto, userId: 1 },
      });
      expect(result).toEqual({ id: 1, userId: 1 });
    });
  });

  describe("update", () => {
    it("should update if user owns the rating", async () => {
      prismaMock.rating.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      prismaMock.rating.update.mockResolvedValue({
        id: 1,
        userId: 1,
        rating: 4,
      });
      const dto = { rating: 4 };
      const result = await service.update(1, dto, 1);
      expect(result).toEqual({ id: 1, userId: 1, rating: 4 });
    });
    it("should throw ForbiddenException if user does not own the rating", async () => {
      prismaMock.rating.findUnique.mockResolvedValue({ id: 1, userId: 2 });
      await expect(service.update(1, { rating: 3 }, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
    it("should throw NotFoundException if rating does not exist", async () => {
      prismaMock.rating.findUnique.mockResolvedValue(null);
      await expect(service.update(1, { rating: 3 }, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("remove", () => {
    it("should delete if user owns the rating", async () => {
      prismaMock.rating.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      prismaMock.rating.delete.mockResolvedValue({ id: 1 });
      const result = await service.remove(1, 1);
      expect(result).toEqual({ id: 1 });
    });
    it("should throw ForbiddenException if user does not own the rating", async () => {
      prismaMock.rating.findUnique.mockResolvedValue({ id: 1, userId: 2 });
      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });
    it("should throw NotFoundException if rating does not exist", async () => {
      prismaMock.rating.findUnique.mockResolvedValue(null);
      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAllByUserId", () => {
    it("should return all ratings for a user", async () => {
      const ratings = [
        { id: 1, userId: 1, movieId: 1, rating: 5, description: "Great!" },
        { id: 2, userId: 1, movieId: 2, rating: 4, description: "Good!" },
      ];
      prismaMock.rating.findMany.mockResolvedValue(ratings);
      const result = await service.findAllByUserId(1);
      expect(prismaMock.rating.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(result).toEqual(ratings);
    });
  });
});
