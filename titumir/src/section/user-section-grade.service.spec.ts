import { Test, TestingModule } from "@nestjs/testing";
import { UserSectionGradeService } from "./user-section-grade.service";

describe("UserSectionGradeService", () => {
  let service: UserSectionGradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSectionGradeService],
    }).compile();

    service = module.get<UserSectionGradeService>(UserSectionGradeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
