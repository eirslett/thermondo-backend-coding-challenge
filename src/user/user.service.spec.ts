import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma.service";

describe("UserService", () => {
  let service: UserService;

  const mockUser = { id: 1, name: "Alice" };
  const findUniqueMock = jest.fn().mockResolvedValue(mockUser);
  const prismaMock = {
    user: {
      findUnique: findUniqueMock,
    },
  };

  beforeEach(async () => {
    findUniqueMock.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return a user by id", async () => {
    const user = await service.findOne(1);
    expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(user).toEqual(mockUser);
  });
});
