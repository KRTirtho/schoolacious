import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { Server } from "http";
import {
  createSchool,
  CreateSchoolReturns,
  signUpUser,
  SignUpUserReturns,
} from "../e2e-test.util";
import InvitationJoinDTO from "../../src/invitation-join/dto/invitation-join.dto";
import Invitations_Joins, {
  INVITATION_OR_JOIN_ROLE,
  INVITATION_OR_JOIN_TYPE,
} from "../../src/database/entity/invitations_or_joins.entity";
import { bootstrapApp } from "../e2e-test.util";
import { AppModule } from "../../src/app.module";
import { getRepository } from "typeorm";

describe("InvitationJoinModule (e2e) PATH: /invitation-join", () => {
  let app: INestApplication;
  let server: Server;
  let client: request.SuperTest<request.Test>;
  const averageSchool = {
    name: "Saitama Kindergarten",
    description: "Best kindergarten in Kasukabe",
    email: "siatama@kindergarten.edu",
    phone: "8801112345678",
    short_name: "saitama-kindergraten",
  };
  const averageInvitation: InvitationJoinDTO = {
    role: INVITATION_OR_JOIN_ROLE.teacher,
    type: INVITATION_OR_JOIN_TYPE.invitation,
  };
  let school: CreateSchoolReturns;
  let authorization: string;

  // mocks
  let invitationMockUser: SignUpUserReturns;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bootstrapApp(app);
    await app.init();
    server = app.getHttpServer();
    client = request(server);
    school = await createSchool(client, averageSchool);
    authorization = `Bearer ${school.user.headers["x-access-token"]}`;

    // mocks
    invitationMockUser = await signUpUser(client, {
      email: "invitation@mock.blah",
      first_name: "Mock",
      last_name: "Boy",
      password: "what the mock",
    });
    averageInvitation.user_id = invitationMockUser.body._id;
  });

  test("/ (POST) perfect invitation", async () => {
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", authorization)
      .send(averageInvitation)
      .expect(HttpStatus.CREATED);
    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("role");
    expect(body).toHaveProperty("user");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("school");
    expect(body).toHaveProperty("created_at");

    expect(body.user._id).toEqual(averageInvitation.user_id);
    expect(body.school._id).toEqual(school.body._id);
  });
  // test("/ (POST) perfect join", () => {});
  // test("/ (POST) invite without user_id", () => {});
  // test("/ (POST) join without school_id", () => {});
  // test("/ (POST) invite with invalid user_id", () => {});
  // test("/ (POST) join with invalid school_id", () => {});
  // test("/ (POST) inviting someone, already joined a school", () => {});
  // test("/ (POST) join while already being in a school", () => {});
  // test("/ (POST) duplicate invitation", () => {});
  // test("/ (POST) duplicate join", () => {});
  // test("/ (POST) sending invitation from non-admin/co-admin user", () => {});
  // test("/ (POST) sending invitation with school_id", () => {});
  // test("/ (POST) sending join with user_id", () => {});

  // test("/ (DELETE) perfect invitation cancel", () => {});
  // test("/ (DELETE) perfect join cancel", () => {});
  // test("/ (DELETE) without required field", () => {});
  // test("/ (DELETE) with invalid _id", () => {});
  // test("/ (DELETE) with wrong credentials", () => {});
  // test("/ (DELETE) cancel invitation from non-admin/co-admin user", () => {});

  // test("/complete (POST) accept perfect invitation complete", () => {});
  // test("/complete (POST) reject perfect invitation complete", () => {});
  // test("/complete (POST) accept perfect join complete", () => {});
  // test("/complete (POST) reject perfect join complete", () => {});
  // test("/complete (POST) accept without _id", () => {});
  // test("/complete (POST) reject without _id", () => {});
  // test("/complete (POST) accept with invalid _id", () => {});
  // test("/complete (POST) reject with invalid _id", () => {});
  // test("/complete (POST) accept wrong credentials", () => {});
  // test("/complete (POST) reject wrong credentials", () => {});
  // test("/complete (POST) accept with not admin/co-admin user", () => {});
  // test("/complete (POST) reject with not admin/co-admin user", () => {});
  // test("/complete (POST) accept while user already join a school meanwhile", () => {});

  afterAll(async () => {
    const invitationJoinRepo = getRepository(Invitations_Joins);
    await invitationJoinRepo.delete({
      user: { _id: averageInvitation.user_id },
    });
    await school.clearSchool();
    await invitationMockUser.clearUser();
    await app.close();
  });
});
