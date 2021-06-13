import { Test, TestingModule } from "@nestjs/testing";
import { GradeController } from "./grade.controller";

describe("GradeController", () => {
    let controller: GradeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GradeController],
        }).compile();

        controller = module.get<GradeController>(GradeController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
