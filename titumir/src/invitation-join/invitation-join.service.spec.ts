/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from "@nestjs/testing";
import { generateMockSchool, generateMockUser } from "../../test/e2e-test.util";
import { UserService } from "../user/user.service";
import { InvitationJoinService } from "./invitation-join.service";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { DeepPartial } from "typeorm";
import { SchoolService } from "../school/school.service";
import School from "../database/entity/schools.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import Invitations_Joins, {
    INVITATION_OR_JOIN_ROLE,
    INVITATION_OR_JOIN_TYPE,
} from "../database/entity/invitations_or_joins.entity";

describe("InvitationJoinService", () => {
    let service: InvitationJoinService;
    const mockUser: User = {
        ...generateMockUser(),
        password: bcrypt.hashSync("mockUserPass", 12),
        _id: uuid(),
        joined_on: new Date(),
        role: null,
    };
    const mockUserService = {
        findOne: jest.fn().mockReturnValue(mockUser),
        findOneAndUpdate: jest
            .fn()
            .mockImplementation((_: unknown, payload: DeepPartial<User>) => ({
                ...mockUser,
                ...payload,
            })),
    };
    const mockSchool: School = {
        ...generateMockSchool(),
        admin: mockUser,
        _id: uuid(),
        created_at: new Date(),
    };

    const mockSchoolService = {
        findOne: jest.fn().mockReturnValue(mockSchool),
    };

    const mockInvitationJoin: Invitations_Joins = {
        _id: uuid(),
        created_at: new Date(),
        role: INVITATION_OR_JOIN_ROLE.teacher,
        type: INVITATION_OR_JOIN_TYPE.invitation,
        school: mockSchool,
        user: mockUser,
    };

    class FakeRepository {
        public create(payload: any): Invitations_Joins {
            return { ...payload, _id: uuid(), created_at: new Date().toISOString() };
        }
        public async save(): Promise<Invitations_Joins> {
            return mockInvitationJoin;
        }
        public async remove(): Promise<void> {}
        public async findOne(): Promise<void> {}
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvitationJoinService,
                {
                    provide: getRepositoryToken(Invitations_Joins),
                    useClass: FakeRepository,
                },
                { provide: UserService, useValue: mockUserService },
                { provide: SchoolService, useValue: mockSchoolService },
            ],
        }).compile();

        service = module.get<InvitationJoinService>(InvitationJoinService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should throw error for user's for not having school", () => {
        const res = () =>
            service.checkUserHasSchool({
                ...mockUser,
                school: mockSchool,
                role: USER_ROLE.teacher,
            });
        expect(res).toThrowError("user already has joined a school");
    });

    it("should create a invitation for given user from given school", async () => {
        const res = await service.invite({
            role: INVITATION_OR_JOIN_ROLE.teacher,
            school: mockSchool,
            user_id: mockUser._id,
        });
        expect(res).toEqual({
            ...mockInvitationJoin,
            _id: expect.any(String),
            created_at: expect.any(Date),
        });
    });

    it("should create a join request from given user for given school", async () => {
        const res = await service.join({
            role: INVITATION_OR_JOIN_ROLE.teacher,
            user: mockUser,
            school_id: mockSchool._id,
        });
        expect(res).toEqual({
            ...mockInvitationJoin,
            _id: expect.any(String),
            created_at: expect.any(Date),
        });
    });
});
