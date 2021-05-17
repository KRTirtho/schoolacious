import { Test, TestingModule } from "@nestjs/testing";
import { InvitationJoinController } from "./invitation-join.controller";

describe("InvitationJoinController", () => {
  let controller: InvitationJoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvitationJoinController],
    }).compile();

    controller = module.get<InvitationJoinController>(InvitationJoinController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
