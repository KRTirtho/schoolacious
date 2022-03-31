import { define } from "typeorm-seeding";
import Section from "../entity/sections.entity";

define(Section, (faker) => {
    const section = new Section();

    section.name = faker.name.title() + faker.commerce.productName();

    return section;
});
