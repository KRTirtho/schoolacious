import { define } from "typeorm-seeding";
import Section from "../entity/sections.entity";

define(Section, (faker) => {
    const section = new Section();

    section.name = faker.datatype.string(3);

    return section;
});
