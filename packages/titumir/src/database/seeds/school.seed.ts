import { Seeder, Factory } from "typeorm-seeding";
import School from "../entity/schools.entity";

export default class CreateSchool implements Seeder {
    public async run(factory: Factory): Promise<void> {
        await factory(School)().createMany(30);
    }
}
