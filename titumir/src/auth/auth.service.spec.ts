import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { NOT_A_SECRET } from "../../config";
import { generateMockUser } from "../../test/e2e-test.util";
import User from "../database/entity/users.entity";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import JwtStrategy from "./strategies/jwt.strategy";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

describe("AuthService", () => {
  let service: AuthService;

  const mockUserPass = "password";
  const mockUser: User = {
    ...generateMockUser(),
    password: bcrypt.hashSync(mockUserPass, 12),
    _id: uuid(),
    joined_on: new Date(),
    role: null,
  };

  const mockUserService = {
    createUser: jest.fn().mockReturnValue(mockUser),
    findOneRaw: jest.fn().mockReturnValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: NOT_A_SECRET,
        }),
      ],
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        JwtStrategy,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("it should successfully validate a user", async () => {
    expect(await service.validate(mockUser.email, mockUserPass)).toEqual({
      ...mockUser,
      password: undefined,
    });
  });

  it("it should throw error for wrong user", async () => {
    expect(service.validate("what@the.hell", mockUserPass)).rejects.toEqual(
      "user doesn't exist"
    );
  });

  it("it should throw error for wrong password", async () => {
    expect(service.validate(mockUser.email, "wrong password")).rejects.toEqual(
      "wrong credentials"
    );
  });
});
