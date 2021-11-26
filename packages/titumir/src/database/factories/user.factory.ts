import { USER_ROLE, USER_STATUS } from "@veschool/types";
import { define } from "typeorm-seeding";
import User from "../entity/users.entity";

define(User, (faker) => {
    const user = new User();

    user.email = faker.internet.email().toLowerCase();
    user.first_name = faker.name.firstName();
    user.last_name = faker.name.lastName();
    user.password = "$2b$12$d5VvFRvISzGZtYU0CZdfAuKU/Q3sYBfF4OIGt2dGwaEF4AZ/4qiDe"; // bcrypt -> 12345678
    user.role = faker.random.arrayElement(Object.values(USER_ROLE));
    user.status = USER_STATUS.offline;

    return user;
});
