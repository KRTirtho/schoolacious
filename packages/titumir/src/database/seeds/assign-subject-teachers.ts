/**
 * Run this file after Running complete-school seed
 * Depends on the order of execution
 */

import { USER_ROLE } from "@schoolacious/types";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import GradeToSubject from "../entity/grade_subject.entity";
import Section from "../entity/sections.entity";
import TeachersToSectionsToGrades from "../entity/teachers_sections_grades.entity";
import User from "../entity/users.entity";

export class AssignSubjectTeachers implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<void> {
        const sections = await connection.manager
            .getRepository(Section)
            .find({ relations: ["grade", "grade.school"] });

        for (const section of sections) {
            const gradeToSubjects = await connection.manager
                .getRepository(GradeToSubject)
                .find({ where: { grade: section.grade }, relations: ["subject"] });
            // subject has a inner subject
            for (const { subject } of gradeToSubjects) {
                await factory(TeachersToSectionsToGrades)()
                    .map(async (tsg) => {
                        Object.assign(tsg, {
                            grade: section.grade,
                            section,
                            subject,
                            user: await factory(User)()
                                .map(async (user) => {
                                    user.school = section.grade.school;
                                    user.role = USER_ROLE.teacher;
                                    return user;
                                })
                                .create(),
                        });
                        return tsg;
                    })
                    .create();
            }
        }
    }
}
