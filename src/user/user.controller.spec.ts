import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthenticatedRequest } from "../auth/auth.guard";
import { User } from "@prisma/client";

const mockUserService = () => ({
  findOne: jest.fn(),
});

describe("UserController", () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useFactory: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
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
});
