import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { InvitationJoinModule } from "../../src/invitation-join/invitation-join.module";

describe("InvitationJoinModule (e2e) PATH: /invitation-join", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InvitationJoinModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (POST) perfect invitation", () => {});
  it("/ (POST) perfect join", () => {});
  it("/ (POST) invite without user_id", () => {});
  it("/ (POST) join without school_id", () => {});
  it("/ (POST) invite with invalid user_id", () => {});
  it("/ (POST) join with invalid school_id", () => {});
  it("/ (POST) inviting someone, already joined a school", () => {});
  it("/ (POST) join while already being in a school", () => {});
  it("/ (POST) duplicate invitation", () => {});
  it("/ (POST) duplicate join", () => {});
  it("/ (POST) sending invitation from non-admin/co-admin user", () => {});
  it("/ (POST) sending invitation with school_id", () => {});
  it("/ (POST) sending join with user_id", () => {});

  it("/ (DELETE) perfect invitation cancel", () => {});
  it("/ (DELETE) perfect join cancel", () => {});
  it("/ (DELETE) without required field", () => {});
  it("/ (DELETE) with invalid _id", () => {});
  it("/ (DELETE) with wrong credentials", () => {});
  it("/ (DELETE) cancel invitation from non-admin/co-admin user", () => {});

  it("/complete (POST) accept perfect invitation complete", () => {});
  it("/complete (POST) reject perfect invitation complete", () => {});
  it("/complete (POST) accept perfect join complete", () => {});
  it("/complete (POST) reject perfect join complete", () => {});
  it("/complete (POST) accept without _id", () => {});
  it("/complete (POST) reject without _id", () => {});
  it("/complete (POST) accept with invalid _id", () => {});
  it("/complete (POST) reject with invalid _id", () => {});
  it("/complete (POST) accept wrong credentials", () => {});
  it("/complete (POST) reject wrong credentials", () => {});
  it("/complete (POST) accept with not admin/co-admin user", () => {});
  it("/complete (POST) reject with not admin/co-admin user", () => {});
  it("/complete (POST) accept while user already join a school meanwhile", () => {});

  afterAll(() => {
    app.close();
  });
});
