import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { v4 as uuid } from "uuid";
import httpMocks from "node-mocks-http";
import { generateMockUser } from "../../test/e2e-test.util";
import User from "../database/entity/users.entity";
import { CONST_REFRESH_TOKEN_HEADER } from "../../config";
import { UserService } from "../user/user.service";

describe("AuthController", () => {
    let controller: AuthController;

    const mockUser: User = {
        ...generateMockUser(),
        _id: uuid(),
        joined_on: new Date(),
        role: null,
    };

    const tokenMock = {
        access_token: uuid(),
        refresh_token: uuid(),
    };
    const mockAuthService = {
        createTokens: jest.fn(() => tokenMock),
        verify: jest.fn().mockReturnValue(mockUser),
    };
    const mockUserService = {
        createUser: jest.fn().mockReturnValue(mockUser),
    };

    const mockReq = httpMocks.createRequest({
        user: mockUser,
        res: httpMocks.createResponse(),
    });

    const mockRes = httpMocks.createResponse();
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("login should return <user> with credential headers", async () => {
        expect(await controller.login(mockUser, mockRes)).toEqual(mockUser);
        expect(mockReq.res?.getHeaders()).toHaveProperty(CONST_REFRESH_TOKEN_HEADER);
    });

    it("should refresh access token", async () => {
        const token = uuid();
        expect(
            await controller.refresh({ [CONST_REFRESH_TOKEN_HEADER]: token }, mockRes),
        ).toEqual({ message: "Refreshed access_token" });
        expect(mockReq.res?.getHeaders()).toHaveProperty(CONST_REFRESH_TOKEN_HEADER);
        expect(mockReq.res?.getHeader(CONST_REFRESH_TOKEN_HEADER)).not.toEqual(token);
    });

    it("should throw error when refresh token not passed", () => {
        expect(controller.refresh({}, mockRes)).rejects.toEqual("refresh token not set");
    });

    it("should create an user & return with access_token & refresh_token", async () => {
        expect(await controller.signup(mockUser, mockRes)).toEqual(mockUser);
        expect(mockReq.res?.getHeaders()).toHaveProperty(CONST_REFRESH_TOKEN_HEADER);
    });
});
