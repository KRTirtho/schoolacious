import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    NotAcceptableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import BasicEntityService, {
    PartialKey,
} from "../database/abstracts/entity-service.abstract";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { GradeService } from "../grade/grade.service";
import { UserService } from "../user/user.service";
import { isGradeAdministrative } from "../utils/helper-functions.util";

type CreateSchool = PartialKey<School, "_id" | "created_at">;

@Injectable()
export class SchoolService extends BasicEntityService<School, CreateSchool> {
    constructor(
        @InjectRepository(School) private readonly schoolRepo: Repository<School>,
        private readonly userService: UserService,
        @Inject(forwardRef(() => GradeService))
        private readonly gradeService: GradeService,
    ) {
        super(schoolRepo);
    }
    // after creation of school admin/user needs to be assigned
    // automatically as a `admin` USER_ROLE
    // if user already has school then the flow will break
    async createSchool(payload: CreateSchool): Promise<School> {
        const hasSchool = await this.userHasSchool(payload.admin._id);
        if (hasSchool || payload.admin.role) {
            throw new BadRequestException("user already has joined a school");
        }
        const newSchool = await super.create(payload);

        const admin = await this.userService.findOneAndUpdate(
            { _id: payload.admin._id },
            {
                role: USER_ROLE.admin,
                school: newSchool,
            },
        );
        delete admin.school; // for circular json
        newSchool.admin = admin;
        return newSchool;
    }

    protected async userHasSchool(user_id: string): Promise<boolean> {
        const school = await this.schoolRepo.findOne({ admin: { _id: user_id } });
        return !!school;
    }

    async assignCoAdmin({
        index,
        user,
        user_id,
    }: {
        user_id: string;
        user: User;
        index: number;
    }) {
        const assignee = await this.userService.findOne(
            { _id: user_id },
            { select: ["role", "_id", "school"], relations: ["school"] },
        );

        if (assignee.role === USER_ROLE.coAdmin) {
            throw new NotAcceptableException(
                "user already is a co-admin. Cannot assign twice",
            );
        } else if (isGradeAdministrative(assignee.role)) {
            // removing user from grade moderator as a user can't be both
            // grade-(moderator/examiner) & co-admin at a same time
            await this.gradeService.removeRole(
                assignee,
                assignee.role as USER_ROLE.gradeExaminer | USER_ROLE.gradeModerator,
                false,
            );
        }
        if (assignee?.school?._id !== user.school?._id)
            throw new BadRequestException("user doesn't belong to same school");
        const payload: DeepPartial<School> = {};
        const coAdmin = index === 1 ? "coAdmin1" : "coAdmin2";
        payload[coAdmin] = assignee;
        const school = await this.findOne(
            { _id: user.school?._id },
            { relations: [coAdmin] },
        );
        // working with previous co-admin(s)
        if (school[coAdmin]) {
            await this.removeCoAdmin(school[coAdmin]!, school);
        }
        Object.assign(school, payload);
        const updatedSchool = await this.schoolRepo.save(school);
        assignee.school = updatedSchool;
        assignee.role = USER_ROLE.coAdmin;
        // saving the new co-admin
        await this.userService.save(assignee);
        Object.assign(school[coAdmin], {
            role: USER_ROLE.coAdmin,
            school: undefined,
        });
        return school;
    }

    async removeCoAdmin(user: string | User, school: School, updateUser = true) {
        if (typeof user === "string") {
            user = await this.userService.findOne(
                { _id: user },
                { relations: ["school"] },
            );
        }
        if (user?.school?._id !== school._id)
            throw new BadRequestException("user doesn't belong to the school");
        if (user.role !== USER_ROLE.coAdmin)
            throw new BadRequestException("user isn't a co-admin");

        const coAdminField = school?.coAdmin1?._id === user._id ? "coAdmin1" : "coAdmin2";
        if (!school[coAdminField])
            throw new NotAcceptableException("school has no co-admin");
        school[coAdminField] = undefined;
        if (updateUser) {
            user.role = USER_ROLE.teacher;
            await this.userService.save(user);
        }
        return await this.schoolRepo.save(school);
    }
}
