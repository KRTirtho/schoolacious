import { Test, TestingModule } from "@nestjs/testing";
import { GradeSubjectService } from "./grade-subject.service";

describe("GradeSubjectService", () => {
    let service: GradeSubjectService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GradeSubjectService],
        }).compile();

        service = module.get<GradeSubjectService>(GradeSubjectService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
