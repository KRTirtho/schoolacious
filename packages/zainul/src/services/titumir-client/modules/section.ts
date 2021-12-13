import {
    SectionSchema,
    StudentsToSectionsToGradesSchema,
    SubjectSchema,
    TeachersToSectionsToGradesSchema,
    UserSchema,
} from "@veschool/types";
import { Connector, TitumirResponse } from "../Connector";

export interface SectionStudentsResponseProperties {
    users: StudentsToSectionsToGradesSchema[];
    error: string[];
}

export type SectionAddStudentsProperties = Pick<UserSchema, "_id">;
export interface SectionAddTeacherProperties {
    email: string;
    subject_id: string;
}
export interface SectionProperties {
    section: string;
    class_teacher: string;
}

export interface SectionPrefixIds {
    school: string;
    grade: number;
}

export type SectionSchemaWithSubject = Omit<SectionSchema, "grade"> & {
    subjects: { subject: SubjectSchema; teacher: UserSchema | null }[] | null;
};

export class TitumirSectionModule extends Connector {
    constructor(
        prefix: string,
        public prefixIds: SectionPrefixIds,
        public sectionId?: string,
    ) {
        super(
            prefix,
            `/school/${prefixIds.school}/grade/${prefixIds.grade}/section`,
            TitumirSectionModule.name,
        );
    }

    public setSectionId(sectionId: string) {
        this.sectionId = sectionId;
    }

    public setPrefixIds(prefixIds: Partial<SectionPrefixIds>) {
        if (prefixIds.school) this.prefixIds.school = prefixIds.school;
        if (prefixIds.grade) this.prefixIds.grade = prefixIds.grade;
        super.baseURL = `/school/${this.prefixIds.school}/grade/${this.prefixIds.grade}/section`;
    }

    public verifySectionId(section?: string) {
        if (!section && !this.sectionId)
            throw new TypeError("[TitumirSectionError]: Section Id isn't provided");
        return section ?? this.sectionId;
    }

    async create(data: SectionProperties): Promise<TitumirResponse<SectionSchema>> {
        return await this.buildRequest<SectionSchema, SectionProperties>(
            "/",
            "POST",
            data,
        );
    }

    async get(section: string): Promise<TitumirResponse<SectionSchemaWithSubject>> {
        return await this.buildRequest<SectionSchemaWithSubject>(section);
    }

    async addTeacher(
        data: SectionAddTeacherProperties,
        section?: string,
    ): Promise<TitumirResponse<TeachersToSectionsToGradesSchema>> {
        const id = this.verifySectionId(section);
        return await this.buildRequest<
            TeachersToSectionsToGradesSchema,
            SectionAddTeacherProperties
        >(`${id}/teacher`, "PUT", data);
    }

    async addStudents(
        data: SectionAddStudentsProperties[],
        section?: string,
    ): Promise<TitumirResponse<SectionStudentsResponseProperties>> {
        const id = this.verifySectionId(section);
        return await this.buildRequest<
            SectionStudentsResponseProperties,
            SectionAddStudentsProperties[]
        >(`${id}/students`, "PUT", data);
    }

    async listTeacher(
        section?: string,
    ): Promise<TitumirResponse<TeachersToSectionsToGradesSchema[]>> {
        const id = this.verifySectionId(section);
        return await this.buildRequest<TeachersToSectionsToGradesSchema[]>(
            `${id}/teachers`,
        );
    }
}
