import { Test, TestingModule } from "@nestjs/testing";
import User from "../database/entity/users.entity";
import { USER_ROLE } from "@schoolacious/types";
import { SchoolService } from "../school/school.service";
import { UserService } from "../user/user.service";
import { GradeService } from "./grade.service";

describe("GradeService", () => {
    let service: GradeService;

    const mockUserService = {
        findOne: jest.fn().mockReturnValue({}),
        save: jest.fn().mockReturnValue({}),
    };

    const mockSchoolService = {
        removeCoAdmin: jest.fn((assignee: User) =>
            Object.assign(assignee, { role: USER_ROLE.teacher }),
        ),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                GradeService,
                { provide: UserService, useValue: mockUserService },
                { provide: SchoolService, useValue: mockSchoolService },
            ],
        }).compile();

        service = module.get<GradeService>(GradeService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
