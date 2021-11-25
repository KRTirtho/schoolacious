import { define } from "typeorm-seeding";
import School from "../entity/schools.entity";

define(School, (faker) => {
    const school = new School();

    school.name = faker.company.companyName();
    school.description = faker.lorem.paragraph();
    school.email = faker.internet.email().toLowerCase();
    school.phone = faker.phone.phoneNumber().replace("-", "").slice(0, 11);
    school.short_name = faker.internet.userName().toLowerCase();

    return school;
});
