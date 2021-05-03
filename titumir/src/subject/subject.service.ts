import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService, {
  PartialKey,
} from "../database/abstracts/entity-service.abstract";
import Subject from "../database/entity/subjects.entity";

type CreateSubject = PartialKey<Subject, "_id" | "created_at">;

@Injectable()
export class SubjectService extends BasicEntityService<Subject, CreateSubject> {
  constructor(
    @InjectRepository(Subject) private readonly subjectRepo: Repository<Subject>
  ) {
    super(subjectRepo);
  }
}
