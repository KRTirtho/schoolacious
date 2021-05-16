import { Test, TestingModule } from "@nestjs/testing";
import { StudentSectionGradeService } from "./student-section-grade.service";

describe("StudentSectionGradeService", () => {
  let service: StudentSectionGradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentSectionGradeService],
    }).compile();

    service = module.get<StudentSectionGradeService>(
      StudentSectionGradeService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
