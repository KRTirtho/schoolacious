import { Test, TestingModule } from "@nestjs/testing";
import { GradeService } from "./grade.service";

describe("GradeService", () => {
  let service: GradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GradeService],
    }).compile();

    service = module.get<GradeService>(GradeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
