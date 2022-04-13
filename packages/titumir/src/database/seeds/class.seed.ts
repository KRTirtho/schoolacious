import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import Class from "../entity/classes.entity";
import Section from "../entity/sections.entity";

export class CreateClass implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<void> {
        const sections = await connection.manager
            .getRepository(Section)
            .find({ relations: ["grade", "class_teacher"] });

      for (const section of sections) {
        factory(Class)().map(async (_class) => {
          // _class.host = section.;

        })
      }
    }
}
