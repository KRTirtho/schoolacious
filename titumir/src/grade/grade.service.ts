import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  FindConditions,
  FindOneOptions,
  FindManyOptions,
} from "typeorm";
import Grade from "../database/entity/grades.entity";
import School from "../database/entity/schools.entity";
import { USER_ROLE } from "../database/entity/users.entity";
import { SchoolService } from "../school/school.service";
import { UserService } from "../user/user.service";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade) private readonly gradeRepo: Repository<Grade>,
    private readonly schoolService: SchoolService,
    private readonly userService: UserService
  ) {}

  async create(payload: Pick<Grade, "standard" | "school">[]) {
    const grade = this.gradeRepo.create(payload);
    return this.gradeRepo.save(grade);
  }

  findOne(conditions: FindConditions<Grade>, options?: FindOneOptions<Grade>) {
    return this.gradeRepo.findOneOrFail(conditions, options);
  }

  findAll(conditions: FindConditions<Grade>, options?: FindManyOptions<Grade>) {
    return this.gradeRepo.find({ ...conditions, ...options });
  }

  async assignRole({
    role,
    school,
    standard,
    user_id,
  }: {
    user_id: string;
    school: School;
    standard: number;
    role: USER_ROLE.gradeExaminer | USER_ROLE.gradeModerator;
  }) {
    const leaderField =
      role === USER_ROLE.gradeExaminer ? "examiner" : "moderator";
    const assignee = await this.userService.findUser(
      { _id: user_id },
      { relations: ["school"] }
    );
    // verifying user's school
    if (assignee?.school?._id !== school._id)
      throw new BadRequestException("user doesn't belong to the school");
    // check if users was a moderator/examiner already & update that grade
    // to set the [role field] as NULL
    if ([USER_ROLE.gradeExaminer, USER_ROLE.gradeModerator].includes(role)) {
      const assigneeGrade = await this.gradeRepo.findOne({
        [leaderField]: user_id,
      });
      if (assigneeGrade) {
        assigneeGrade[leaderField] = null;
        await this.gradeRepo.save(assigneeGrade);
      }
    }

    const grade = await this.findOne({ standard, school: { _id: school._id } });
    grade[leaderField] = assignee;
    assignee.role = role;

    const [updatedGrade, updatedAssignee] = await Promise.all([
      this.gradeRepo.save(grade),
      this.userService.save(assignee),
    ]);

    delete updatedAssignee.school;

    updatedGrade[leaderField] = updatedAssignee;

    return updatedGrade;
  }
}
