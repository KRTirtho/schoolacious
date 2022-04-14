import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import Grade from "../database/entity/grades.entity";
import School from "../database/entity/schools.entity";
import Section from "../database/entity/sections.entity";
import StudentsToSectionsToGrades from "../database/entity/students_sections_grades.entity";
import User from "../database/entity/users.entity";
import { NOTIFICATION_INDICATOR_ICON, USER_ROLE } from "@schoolacious/types";
import { UserService } from "../user/user.service";
import Notifications from "../database/entity/notifications.entity";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class StudentSectionGradeService extends BasicEntityService<StudentsToSectionsToGrades> {
    constructor(
        @InjectRepository(StudentsToSectionsToGrades)
        private ssgRepo: Repository<StudentsToSectionsToGrades>,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        private notificationService: NotificationService,
    ) {
        super(ssgRepo);
    }

    async addStudents(
        user_ids: string[],
        school: School,
        grade: Grade,
        section: Section,
    ) {
        const users = await this.userService.find(
            { _id: In(user_ids) },
            { relations: ["school"] },
        );

        const invalidUsers = [];
        const validUserPayload = [];

        for (const user of users) {
            if (user.school?._id !== school._id)
                invalidUsers.push(`${user._id} doesn't belong to the school`);
            // only students can be added as a student to any other section-grade
            else if (user.role !== USER_ROLE.student)
                invalidUsers.push(
                    `${user._id} is a ${user.role?.valueOf()}, can't add as a student`,
                );
            else {
                validUserPayload.push({ user, grade, section });
            }
        }
        const createdUsers = await this.create(validUserPayload);

        /**
         * sending notification to all the user who got added in this
         * section
         */
        const notificationsPayload: Partial<Notifications>[] = createdUsers.map(
            (ssg) => ({
                description: `You got added to grade-${ssg.grade.standard} section-${ssg.section.name}`,
                open_link: `/school/configure/grade-sections/${ssg.grade.standard}/${ssg.section.name}`,
                owner_id: ssg.section._id,
                receiver: ssg.user,
                title: `Got added to grade-${ssg.grade.standard} section-${ssg.section.name}`,
                type_indicator_icon: NOTIFICATION_INDICATOR_ICON.addedToSection,
                avatar_url: "N/A",
            }),
        );
        const notifications = await this.notificationService.create(notificationsPayload);
        for (const notification of notifications) {
            Object.assign(notification, { receiver: undefined });
            await this.notificationService.sendNotification(
                notification.receiver._id,
                notification,
            );
        }
        return { users: createdUsers, error: invalidUsers };
    }

    async removeStudent(user: string | User) {
        if (typeof user === "string")
            user = await this.userService.findOne({ _id: user });
        // only students
        if (user.role !== USER_ROLE.student)
            throw new BadRequestException("user isn't a student");
        // ssg = Student Section Grade
        const ssg = await this.findOne({ user }, { relations: ["grade", "section"] });
        delete (ssg as any).assigned_at;
        const deleteResult = await this.ssgRepo.delete(ssg);
        if (deleteResult.affected !== 1)
            throw new InternalServerErrorException("failed removing student");

        /**
         * sending notification to the user who got removed from this
         * section
         */
        const notification = await this.notificationService.create({
            description: `You were removed from grade-${ssg.grade.standard} section-${ssg.section.name}`,
            open_link: `/school/configure/grade-sections/${ssg.grade.standard}/${ssg.section.name}`,
            owner_id: ssg.section._id,
            receiver: ssg.user,
            title: `You've been removed from grade-${ssg.grade.standard} section-${ssg.section.name}`,
            type_indicator_icon: NOTIFICATION_INDICATOR_ICON.removedFromSection,
            avatar_url: "N/A",
        });
        Object.assign(notification, { receiver: undefined });
        await this.notificationService.sendNotification(
            notification.receiver._id,
            notification,
        );
        return { message: "successfully removed student" };
    }
}
