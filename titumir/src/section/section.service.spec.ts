import { Test, TestingModule } from "@nestjs/testing";
import { SectionService } from "./section.service";

describe("SectionService", () => {
    let service: SectionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SectionService],
        }).compile();

        service = module.get<SectionService>(SectionService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
