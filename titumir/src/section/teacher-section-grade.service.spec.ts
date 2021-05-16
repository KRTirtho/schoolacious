import { Test, TestingModule } from "@nestjs/testing";
import { TeacherSectionGradeService } from "./teacher-section-grade.service";

describe("TeacherSectionGradeService", () => {
  let service: TeacherSectionGradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherSectionGradeService],
    }).compile();

    service = module.get<TeacherSectionGradeService>(
      TeacherSectionGradeService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
