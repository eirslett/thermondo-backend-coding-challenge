import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthenticatedRequest } from "../auth/auth.guard";
import { User } from "@prisma/client";
import { RatingService } from "../rating/rating.service";

const mockUserService = () => ({
  findOne: jest.fn(),
});

const mockRatingService = () => ({
  findAllByUserId: jest.fn(),
});

describe("UserController", () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;
  let ratingService: jest.Mocked<RatingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useFactory: mockUserService },
        { provide: RatingService, useFactory: mockRatingService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
    ratingService = module.get<RatingService>(
      RatingService,
    ) as jest.Mocked<RatingService>;
  });

  describe("me", () => {
    it("should return the user if authenticated and found", async () => {
      const user: User = { id: 1, name: "Test User" };
      userService.findOne.mockResolvedValue(user);
      const req: Partial<AuthenticatedRequest> = { user: { id: 1 } };
      await expect(controller.me(req as AuthenticatedRequest)).resolves.toEqual(
        user,
      );
      expect(userService.findOne).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException if user not found", async () => {
      userService.findOne.mockResolvedValue(null);
      const req: Partial<AuthenticatedRequest> = { user: { id: 1 } };
      await expect(controller.me(req as AuthenticatedRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw UnauthorizedException if not authenticated", async () => {
      const req: Partial<AuthenticatedRequest> = {};
      await expect(controller.me(req as AuthenticatedRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("myRatings", () => {
    it("should return ratings for the authenticated user", async () => {
      const ratings = [
        { id: 1, userId: 1, movieId: 1, rating: 5, description: "Great!" },
        { id: 2, userId: 1, movieId: 2, rating: 4, description: "Good!" },
      ];
      ratingService.findAllByUserId.mockResolvedValue(ratings);
      const req: Partial<AuthenticatedRequest> = { user: { id: 1 } };
      await expect(
        controller.myRatings(req as AuthenticatedRequest),
      ).resolves.toEqual(ratings);
      expect(ratingService.findAllByUserId).toHaveBeenCalledWith(1);
    });

    it("should throw UnauthorizedException if not authenticated", async () => {
      const req: Partial<AuthenticatedRequest> = {};
      await expect(
        controller.myRatings(req as AuthenticatedRequest),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
