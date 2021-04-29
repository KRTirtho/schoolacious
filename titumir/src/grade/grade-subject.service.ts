import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from "typeorm";
import GradeToSubject from "../database/entity/grade_subject.entity";
import Subject from "../database/entity/subjects.entity";

interface GradeToSubjectCreatePayload extends Pick<GradeToSubject, "grade"> {
  subject: { _id: string } & Omit<DeepPartial<Subject>, "_id">;
  mark?: number;
}

@Injectable()
export class GradeSubjectService {
  constructor(
    @InjectRepository(GradeToSubject)
    private readonly gradeSubjectRepo: Repository<GradeToSubject>
  ) {}

  async create(payload: GradeToSubjectCreatePayload[]) {
    const gradeSubject = this.gradeSubjectRepo.create(payload);

    return await this.gradeSubjectRepo.save(gradeSubject);
  }

  findOne(
    conditions: FindConditions<GradeToSubject>,
    options?: FindOneOptions<GradeToSubject>
  ) {
    return this.gradeSubjectRepo.findOneOrFail(conditions, options);
  }

  findAll(
    conditions: FindConditions<GradeToSubject>,
    options?: FindManyOptions<GradeToSubject>
  ) {
    return this.gradeSubjectRepo.find({ ...conditions, ...options });
  }
}
