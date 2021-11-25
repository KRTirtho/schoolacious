import { Factory, Seeder } from "typeorm-seeding";
import User from "../entity/users.entity";

export default class CreateUser implements Seeder {
    public async run(factory: Factory): Promise<void> {
        await factory(User)().createMany(100);
    }
}
