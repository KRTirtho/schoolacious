import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import TeachersToSectionsToGrades from "../database/entity/teachers_sections_grades.entity";

@Injectable()
export class TeacherSectionGradeService extends BasicEntityService<TeachersToSectionsToGrades> {
  constructor(
    @InjectRepository(TeachersToSectionsToGrades)
    private readonly tsgRepo: Repository<TeachersToSectionsToGrades>
  ) {
    super(tsgRepo);
  }
}
