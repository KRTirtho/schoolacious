import { Test, TestingModule } from "@nestjs/testing";
import { InvitationJoinService } from "./invitation-join.service";

describe("InvitationJoinService", () => {
  let service: InvitationJoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitationJoinService],
    }).compile();

    service = module.get<InvitationJoinService>(InvitationJoinService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
