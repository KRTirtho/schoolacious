import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import StudentsToSectionsToGrades from "../database/entity/students_sections_grades.entity";

@Injectable()
export class StudentSectionGradeService extends BasicEntityService<StudentsToSectionsToGrades> {
  constructor(
    @InjectRepository(StudentsToSectionsToGrades)
    private readonly ssgRepo: Repository<StudentsToSectionsToGrades>
  ) {
    super(ssgRepo);
  }
}
