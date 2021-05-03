import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService, {
  PartialKey,
} from "../database/abstracts/entity-service.abstract";
import Grade from "../database/entity/grades.entity";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { SchoolService } from "../school/school.service";
import { UserService } from "../user/user.service";

type CreateGrade = PartialKey<Grade, "_id" | "created_at">;

@Injectable()
export class GradeService extends BasicEntityService<Grade, CreateGrade> {
  constructor(
    @InjectRepository(Grade) private readonly gradeRepo: Repository<Grade>,
    private readonly schoolService: SchoolService,
    private readonly userService: UserService
  ) {
    super(gradeRepo);
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
    const assignee = await this.userService.findOne(
      { _id: user_id },
      { relations: ["school"] }
    );
    // verifying user's school
    if (assignee?.school?._id !== school._id)
      throw new BadRequestException("user doesn't belong to the school");
    // check if users was a moderator/examiner already & update that grade
    // to set the [role field] as NULL
    if (
      [USER_ROLE.gradeExaminer, USER_ROLE.gradeModerator].includes(
        assignee.role
      )
    ) {
      await this.removeRole(assignee, role, false);
    } else if (assignee.role === USER_ROLE.coAdmin) {
      await this.schoolService.removeCoAdmin(assignee, school, false);
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

  async removeRole(
    user: string | User,
    role: USER_ROLE.gradeExaminer | USER_ROLE.gradeModerator,
    updateUser = true
  ) {
    const leaderField =
      role === USER_ROLE.gradeExaminer ? "examiner" : "moderator";
    if (typeof user === "string") {
      user = await this.userService.findOne(
        { _id: user },
        { relations: ["school"] }
      );
    }
    if (
      ![USER_ROLE.gradeExaminer, USER_ROLE.gradeModerator].includes(user.role)
    )
      throw new BadRequestException(`user isn't a/an ${leaderField}`);
    const grade = await this.findOne(
      {
        [leaderField]: user._id,
      },
      { relations: ["school"] }
    );
    if (updateUser) {
      user.role = USER_ROLE.teacher;
      await this.userService.save(user);
    }
    grade[leaderField] = null;
    return await this.gradeRepo.save(grade);
  }
}
