import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import Class from "../entity/classes.entity";
import TeachersToSectionsToGrades from "../entity/teachers_sections_grades.entity";

export class CreateClass implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<void> {
        const subjectTeachers = await connection.manager
            .getRepository(TeachersToSectionsToGrades)
            .find();
        for (const teacher of subjectTeachers) {
            await factory(Class)()
                .map(async (_class) => {
                    _class.host = teacher;
                    return _class;
                })
                .create();
        }
    }
}
