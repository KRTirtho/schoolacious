import { USER_ROLE } from "@schoolacious/types";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import Grade from "../entity/grades.entity";
import GradeToSubject from "../entity/grade_subject.entity";
import School from "../entity/schools.entity";
import Section from "../entity/sections.entity";
import Subject from "../entity/subjects.entity";
import User from "../entity/users.entity";

export default class CreateCompleteSchool implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<void> {
        // creating Schools
        const schools = await factory(School)()
            .map(async (school) => {
                school.admin = await factory(User)().create();
                return school;
            })
            .createMany(5);

        for (const school of schools) {
            school.grades = [];
            // Updating the admin-user data
            await connection
                .createQueryBuilder()
                .update(User)
                .set({
                    role: USER_ROLE.admin,
                    school,
                })
                .where("_id = :id", { id: school.admin._id })
                .execute();

            // appending co-admins
            await connection
                .createQueryBuilder()
                .update(School)
                .set({
                    coAdmin1: await factory(User)()
                        .map(async (user) => {
                            Object.assign(user, {
                                school,
                                role: USER_ROLE.coAdmin,
                            });
                            return user;
                        })
                        .create(),
                    coAdmin2: await factory(User)()
                        .map(async (user) => {
                            Object.assign(user, {
                                school,
                                role: USER_ROLE.coAdmin,
                            });
                            return user;
                        })
                        .create(),
                })
                .where("_id=:id", { id: school._id })
                .execute();

            // creating Subjects
            const subjects = await factory(Subject)()
                .map(async (subject) => {
                    subject.school = school;
                    return subject;
                })
                .createMany(10);

            // creating Grades
            const grades = await factory(Grade)()
                .map(async (grade) => {
                    grade.school = school;
                    grade.examiner = await factory(User)()
                        .map(async (user) => {
                            Object.assign(user, {
                                school,
                                role: USER_ROLE.gradeExaminer,
                            });
                            return user;
                        })
                        .create();
                    grade.moderator = await factory(User)()
                        .map(async (user) => {
                            Object.assign(user, {
                                school,
                                role: USER_ROLE.gradeModerator,
                            });
                            return user;
                        })
                        .create();
                    school.grades?.push(grade);
                    grade.standard = school.grades?.length ?? 1;
                    return grade;
                })
                .createMany(10);

            // creating Sections
            for (const grade of grades) {
                await factory(Section)()
                    .map(async (section) => {
                        section.grade = grade;
                        section.class_teacher = await factory(User)()
                            .map(async (user) => {
                                Object.assign(user, {
                                    school,
                                    role: USER_ROLE.classTeacher,
                                });
                                return user;
                            })
                            .create();
                        return section;
                    })
                    .createMany(10);

                // creating GradeToSubjects for each subject & each grade
                for (const subject of subjects) {
                    await factory(GradeToSubject)()
                        .map(async (gradeToSubject) => {
                            Object.assign(gradeToSubject, { grade, subject });
                            return gradeToSubject;
                        })
                        .create();
                }
            }
        }
    }
}
