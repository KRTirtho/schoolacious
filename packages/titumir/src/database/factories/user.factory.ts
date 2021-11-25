import { USER_ROLE, USER_STATUS } from "@veschool/types";
import { define } from "typeorm-seeding";
import User from "../entity/users.entity";

define(User, (faker) => {
    const user = new User();

    user.email = faker.internet.email().toLowerCase();
    user.first_name = faker.name.firstName();
    user.last_name = faker.name.lastName();
    user.password = faker.internet.password();
    user.role = faker.random.arrayElement(Object.values(USER_ROLE));
    user.status = USER_STATUS.offline;

    return user;
});
