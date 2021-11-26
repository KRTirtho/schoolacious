import { define } from "typeorm-seeding";
import School from "../entity/schools.entity";

define(School, (faker) => {
    const school = new School();

    school.name = faker.company.companyName();
    school.description = faker.lorem.paragraph();
    school.email = faker.internet.email().toLowerCase();
    school.phone = faker.phone.phoneNumber().replace("-", "").slice(-11);
    school.short_name = faker.internet.userName().toLowerCase().slice(-20);

    return school;
});
