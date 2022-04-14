import { USER_ROLE } from "@schoolacious/types";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import Section from "../entity/sections.entity";
import StudentsToSectionsToGrades from "../entity/students_sections_grades.entity";
import User from "../entity/users.entity";

export class AssignSectionStudents implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<void> {
        const sections = await connection.manager.getRepository(Section).find({
            relations: ["grade", "grade.school"],
        });

        for (const section of sections) {
            // create students for the school of the section
            const student = await factory(User)()
                .map(async (user) => {
                    user.school = section.grade.school;
                    user.role = USER_ROLE.student;
                    return user;
                })
                .create();

            await factory(StudentsToSectionsToGrades)()
                .map(async (ssg) => {
                    ssg.grade = section.grade;
                    ssg.section = section;
                    ssg.user = student;
                    return ssg;
                })
                .create();
        }
    }
}
