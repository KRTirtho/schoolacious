import { define } from "typeorm-seeding";
import Grade from "../entity/grades.entity";

define(Grade, () => {
    const grade = new Grade();
    return grade;
});
