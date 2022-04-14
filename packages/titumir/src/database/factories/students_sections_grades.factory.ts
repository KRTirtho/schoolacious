import { define } from "typeorm-seeding";
import StudentsToSectionsToGrades from "../entity/students_sections_grades.entity";

define(StudentsToSectionsToGrades, () => {
    const ssg = new StudentsToSectionsToGrades();

    return ssg;
});
