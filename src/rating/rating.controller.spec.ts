import { Test, TestingModule } from "@nestjs/testing";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthenticatedRequest } from "../auth/auth.guard";

const mockRatingService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe("RatingController", () => {
  let controller: RatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [{ provide: RatingService, useValue: mockRatingService }],
    }).compile();

    controller = module.get<RatingController>(RatingController);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a rating if authenticated", async () => {
      const dto = { movieId: 1, rating: 5, description: "Great!" };
      const user = { id: 1 };
      const req = { user } as AuthenticatedRequest;
      const created = { id: 1, ...dto, userId: user.id };
      mockRatingService.create.mockResolvedValue(created);
      await expect(controller.create(dto, req)).resolves.toEqual(created);
      expect(mockRatingService.create).toHaveBeenCalledWith(dto, user.id);
    });
    it("should throw UnauthorizedException if not authenticated", async () => {
      const dto = { movieId: 1, rating: 5, description: "Great!" };
      const req = {} as AuthenticatedRequest;
      await expect(controller.create(dto, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("findAll", () => {
    it("should return all ratings", async () => {
      const ratings = [{ id: 1 }, { id: 2 }];
      mockRatingService.findAll.mockResolvedValue(ratings);
      await expect(controller.findAll()).resolves.toEqual(ratings);
      expect(mockRatingService.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a rating by id", async () => {
      const rating = { id: 1 };
      mockRatingService.findOne.mockResolvedValue(rating);
      await expect(controller.findOne("1")).resolves.toEqual(rating);
      expect(mockRatingService.findOne).toHaveBeenCalledWith(1);
    });
    it("should throw NotFoundException if not found", async () => {
      mockRatingService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne("999")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("update", () => {
    it("should update a rating if authenticated", async () => {
      const dto = { rating: 4 };
      const user = { id: 1 };
      const req = { user } as AuthenticatedRequest;
      const updated = { id: 1, ...dto, userId: user.id };
      mockRatingService.update.mockResolvedValue(updated);
      await expect(controller.update("1", dto, req)).resolves.toEqual(updated);
      expect(mockRatingService.update).toHaveBeenCalledWith(1, dto, user.id);
    });
    it("should throw UnauthorizedException if not authenticated", async () => {
      const dto = { rating: 4 };
      const req = {} as AuthenticatedRequest;
      await expect(controller.update("1", dto, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("remove", () => {
    it("should remove a rating if authenticated", async () => {
      const user = { id: 1 };
      const req = { user } as AuthenticatedRequest;
      const removed = { id: 1 };
      mockRatingService.remove.mockResolvedValue(removed);
      await expect(controller.remove("1", req)).resolves.toEqual(removed);
      expect(mockRatingService.remove).toHaveBeenCalledWith(1, user.id);
    });
    it("should throw UnauthorizedException if not authenticated", async () => {
      const req = {} as AuthenticatedRequest;
      await expect(controller.remove("1", req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
