import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  FindConditions,
  FindOneOptions,
  FindManyOptions,
} from "typeorm";
import Grade from "../database/entity/grades.entity";
import { SchoolService } from "../school/school.service";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade) private readonly gradeRepo: Repository<Grade>,
    private readonly schoolService: SchoolService
  ) {}

  async create(
    payload: Omit<
      Grade,
      "sections" | "_id" | "created_at" | "grades_subjects"
    >[]
  ) {
    const grade = this.gradeRepo.create(payload);
    return this.gradeRepo.save(grade);
  }

  findOne(conditions: FindConditions<Grade>, options?: FindOneOptions<Grade>) {
    return this.gradeRepo.findOneOrFail(conditions, options);
  }

  findAll(conditions: FindConditions<Grade>, options?: FindManyOptions<Grade>) {
    return this.gradeRepo.find({ ...conditions, ...options });
  }
}
