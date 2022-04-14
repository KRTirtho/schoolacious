import { define } from "typeorm-seeding";
import TeachersToSectionsToGrades from "../entity/teachers_sections_grades.entity";

define(TeachersToSectionsToGrades, () => {
    const tsg = new TeachersToSectionsToGrades();

    return tsg;
});
