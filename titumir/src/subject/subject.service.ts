import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from "typeorm";
import Subject from "../database/entity/subjects.entity";

type SubjectCreatePayload = Pick<Subject, "name" | "description" | "school">;

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject) private readonly subjectRepo: Repository<Subject>
  ) {}

  async create(payloads: SubjectCreatePayload[]) {
    const subjects = payloads.map((payload) =>
      this.subjectRepo.create(payload)
    );

    return await this.subjectRepo.save(subjects);
  }

  findAll(
    conditions: FindConditions<Subject>,
    options?: FindManyOptions<Subject>
  ) {
    return this.subjectRepo.find({ ...conditions, ...options });
  }

  findOne(
    conditions: FindConditions<Subject>,
    options?: FindOneOptions<Subject>
  ) {
    return this.subjectRepo.findOne(conditions, options);
  }
}
