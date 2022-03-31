import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import GradeToSubject from "../database/entity/grade_subject.entity";
import Subject from "../database/entity/subjects.entity";

interface GradeToSubjectCreatePayload extends Pick<GradeToSubject, "grade"> {
    subject: { _id: string } & Omit<DeepPartial<Subject>, "_id">;
    mark?: number;
}

@Injectable()
export class GradeSubjectService extends BasicEntityService<
    GradeToSubject,
    GradeToSubjectCreatePayload | GradeToSubjectCreatePayload[]
> {
    constructor(
        @InjectRepository(GradeToSubject)
        private readonly gradeSubjectRepo: Repository<GradeToSubject>,
    ) {
        super(gradeSubjectRepo);
    }
}
