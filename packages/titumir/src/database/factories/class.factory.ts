import { CLASS_STATUS } from "@schoolacious/types";
import { define } from "typeorm-seeding";
import Class from "../entity/classes.entity";

define(Class, (faker) => {
    const classes = new Class();

    classes.day = faker.random.number({ min: 0, max: 6, precision: 1 });
    classes.duration = faker.random.number({ min: 600, max: 3600, precision: 1 });
    classes.status = CLASS_STATUS.scheduled;
    classes.time = `${faker.random.number({ min: 0, max: 23 })}:${faker.random.number({
        min: 0,
        max: 59,
    })}:${faker.random.number({ min: 0, max: 59 })}`;

    return classes;
});
