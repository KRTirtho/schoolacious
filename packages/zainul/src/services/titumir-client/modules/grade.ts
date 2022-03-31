import { GradeSchema, GradeToSubjectSchema } from "@schoolacious/types";
import { Connector, TitumirResponse } from "../Connector";

export interface GradeProperties {
    standard: number;
    examiner: string;
    moderator: string;
}

export interface AddGradeSubjectsBody {
    subject_id: string;
    mark: number;
}

export type GradeExtendableProperties =
    | "moderator"
    | "examiner"
    | "sections"
    | "grades_subjects"
    | "grades_subjects.subject"
    | "teachersToSectionsToGrades"
    | "studentsToSectionsToGrade"
    | "sections.class_teacher";

export interface GradeListOptions {
    extendedProperties?: GradeExtendableProperties[];
}

export class TitumirGradeModule extends Connector {
    constructor(prefix: string, public school: string, public gradeId?: number) {
        super(prefix, `/school/${school}/grade`, TitumirGradeModule.name);
    }

    public setGradeId(gradeId: number) {
        this.gradeId = gradeId;
    }

    public setSchool(school: string) {
        this.school = school;
        super.baseURL = `/school/${school}/grade`;
    }

    async create(data: GradeProperties): Promise<TitumirResponse<GradeSchema>> {
        return await this.buildRequest<GradeSchema, GradeProperties>(`/`, "POST", data);
    }

    async list(options?: GradeListOptions): Promise<TitumirResponse<GradeSchema[]>> {
        const extended = options?.extendedProperties
            ? Array.from(new Set(options?.extendedProperties)).join(",")
            : undefined;
        const url = this.stringifyUrl({
            url: "/",
            query: {
                extended,
            },
        });
        return await this.buildRequest<GradeSchema[]>(url);
    }

    async createSubjects(
        subjects: AddGradeSubjectsBody[],
        grade?: number,
    ): Promise<TitumirResponse<GradeToSubjectSchema[]>> {
        return await this.buildRequest<GradeToSubjectSchema[], AddGradeSubjectsBody[]>(
            `${grade ?? this.gradeId}/subject`,
            "POST",
            subjects,
        );
    }
}
