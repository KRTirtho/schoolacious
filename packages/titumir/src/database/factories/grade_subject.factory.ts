import { define } from "typeorm-seeding";
import GradeToSubject from "../entity/grade_subject.entity";

define(GradeToSubject, (faker) => {
    const gradeToSubject = new GradeToSubject();

    gradeToSubject.mark = faker.random.number({ min: 20, max: 100, precision: 1 });

    return gradeToSubject;
});
