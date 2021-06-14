import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService, {
    PartialKey,
} from "../database/abstracts/entity-service.abstract";
import Class from "../database/entity/classes.entity";
import { differenceInMinutes, parse, millisecondsToSeconds } from "date-fns";
import ScheduleClassDto from "./dto/schedule-class.dto";
import Section from "../database/entity/sections.entity";

export type CreateClassPayload = PartialKey<Class, "_id" | "created_at">;

@Injectable()
export class ClassesService extends BasicEntityService<Class, CreateClassPayload> {
    constructor(@InjectRepository(Class) private classRepo: Repository<Class>) {
        super(classRepo);
    }

    async validateHostClass({ host, day }: ScheduleClassDto): Promise<boolean> {
        const hostClasses = await this.find({}, { where: { host: { _id: host }, day } });
        return await this.validateClasses(hostClasses);
    }

    async validateStudentClass(section: Section, day: number) {
        const studentClasses = await this.find({}, { where: { section, day } });
        return this.validateClasses(studentClasses);
    }

    private async validateClasses(classes: Class[]) {
        if (classes.length === 0) return true;
        else if (classes.length >= 6) return false;

        let result = true;
        // validating if class follows the following
        // minimum of 10mins break for both host
        for (const [index, { time, duration }] of classes.entries()) {
            if (index + 1 > classes.length - 1) break;
            const now = new Date();
            const date = parse(time, "KK:mm:ss", now);
            const next = classes[index + 1];
            const dateNext = parse(next.time, "KK:mm:ss", now);
            const diff = differenceInMinutes(date, dateNext);

            if (
                Math.abs(
                    Math.max(
                        millisecondsToSeconds(duration),
                        millisecondsToSeconds(next.duration),
                    ) - diff,
                ) < 10
            ) {
                result = false;
                break;
            }
        }
        return result;
    }
}
