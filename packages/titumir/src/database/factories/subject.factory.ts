import { define } from "typeorm-seeding";
import Subject from "../entity/subjects.entity";

define(Subject, (faker) => {
    const subject = new Subject();

    subject.name = faker.name.title();
    subject.description = faker.lorem.paragraph();

    return subject;
});
