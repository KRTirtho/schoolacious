import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import UsersToSectionsToGrades from "../database/entity/users_sections_grades.entity";

@Injectable()
export class UserSectionGradeService extends BasicEntityService<UsersToSectionsToGrades> {
  constructor(
    @InjectRepository(UsersToSectionsToGrades)
    private readonly usgRepo: Repository<UsersToSectionsToGrades>
  ) {
    super(usgRepo);
  }
}
