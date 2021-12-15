import { ClassSchema } from "@veschool/types";
import { Connector, TitumirResponse } from "../Connector";
import { SectionPrefixIds } from "./section";

export interface ClassProperties {
    date: Date;
    host: string;
    duration: number;
}

export interface ClassSessionProperties {
    token: string;
    subscribers?: string[];
    publishers?: string[];
    createdAt: string;
}

export interface ClassPrefixIds extends SectionPrefixIds {
    section: string;
}

export class TitumirClassModule extends Connector {
    constructor(prefix: string, public prefixIds: ClassPrefixIds) {
        super(
            prefix,
            `/school/${prefixIds.school}/grade/${prefixIds.grade}/section/${prefixIds.section}/class`,
            TitumirClassModule.name,
        );
    }

    public setPrefixIds(prefixIds: Partial<ClassPrefixIds>) {
        if (prefixIds.school) this.prefixIds.school = prefixIds.school;
        if (prefixIds.grade) this.prefixIds.grade = prefixIds.grade;
        if (prefixIds.section) this.prefixIds.section = prefixIds.section;
        super.baseURL = `/school/${this.prefixIds.school}/grade/${this.prefixIds.grade}/section/${this.prefixIds.section}/class`;
    }

    async list(): Promise<TitumirResponse<ClassSchema[]>> {
        return await this.buildRequest<ClassSchema[]>("/");
    }

    async create(data: ClassProperties): Promise<TitumirResponse<ClassSchema>> {
        return await this.buildRequest<ClassSchema, ClassProperties>("/", "POST", data);
    }

    async getSession(
        sessionId: string,
    ): Promise<TitumirResponse<ClassSessionProperties>> {
        return await this.buildRequest<ClassSessionProperties>(sessionId);
    }

    /**@ignore */
    /**@development this route is only for development purposes for the WebRTC conference UI */
    async getDevelopmentSession(
        sessionId: string,
    ): Promise<TitumirResponse<ClassSessionProperties>> {
        return await this.buildRequest<ClassSessionProperties>(`dev/${sessionId}`);
    }
}
