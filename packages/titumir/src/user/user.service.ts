import { Injectable, BadRequestException, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import User from "../database/entity/users.entity";
import {
    Between,
    DeepPartial,
    FindConditions,
    FindOneOptions,
    Repository,
} from "typeorm";
import bcrypt from "bcrypt";
import BasicEntityService, {
    PartialKey,
} from "../database/abstracts/entity-service.abstract";
import { ClassesService } from "../classes/classes.service";
import { USER_ROLE } from "@veschool/types";
import { StudentSectionGradeService } from "../student-section-grade/student-section-grade.service";

type SafeUser = Omit<User, "password">;

type CreateUser = PartialKey<User, "_id" | "joined_on">;

@Injectable()
export class UserService extends BasicEntityService<User, CreateUser> {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @Inject(forwardRef(() => StudentSectionGradeService))
        private readonly ssgService: StudentSectionGradeService,
        private readonly classService: ClassesService,
    ) {
        super(userRepo);
    }

    async createUser({ password, ...props }: CreateUser) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.create({ ...props, password: hashedPassword });
        return { ...user, password: undefined };
    }

    // a special query that returns entire User Object/Column
    // but with the `password` or any other hidden field defined in it
    private buildRawUser(
        conditions: FindConditions<DeepPartial<SafeUser>>,
        options?: Pick<FindOneOptions<User>, "order" | "select" | "where" | "relations">,
    ) {
        const naive = this.queryBuilder("user").where(options?.where ?? conditions);
        if (options?.select) {
            for (const select of options.select) {
                naive.addSelect(`user.${select}`);
            }
        }
        if (options?.order) {
            for (let [key, value] of Object.entries(options?.order)) {
                key = key;
                if (value === 1) {
                    value = "ASC";
                }
                if (value === -1) {
                    value = "DESC";
                }
                naive.addOrderBy(`user.${key}`, value);
            }
        }

        if (options?.relations) {
            for (const relation of options.relations) {
                naive.leftJoinAndSelect(
                    `user.${relation}`,
                    relation,
                    `${relation}._id = user.${relation}`,
                );
            }
        }
        return naive;
    }

    findOneRaw(
        conditions: FindConditions<DeepPartial<SafeUser>>,
        options?: Pick<FindOneOptions<User>, "order" | "select" | "where" | "relations">,
    ) {
        return this.buildRawUser(conditions, options).getOne();
    }

    // simple password changing method for user
    async changePassword(
        _id: string,
        { newPassword, oldPassword }: { oldPassword: string; newPassword: string },
    ) {
        const user = await this.findOne({ _id });
        const isValidPassword = bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            throw new BadRequestException();
        }
        user.password = await bcrypt.hash(newPassword, 12);
        return this.userRepo.save(user);
    }

    async getUpcomingClasses(user: User, day: number, from: string, to: string) {
        const relations = ["host", "host.grade", "host.subject", "host.section"];
        if (user.role === USER_ROLE.student) {
            const { section, grade } = await this.ssgService.findOne(
                { user },
                {
                    relations: ["grade", "section"],
                },
            );
            return await this.classService.find(
                {
                    day,
                    time: Between(from, to),
                    host: { section, grade },
                },
                { relations: [...relations, "host.user"] },
            );
        }
        return await this.classService.find(
            {
                day,
                host: { user },
                time: Between(from, to),
            },
            { relations },
        );
    }
}
