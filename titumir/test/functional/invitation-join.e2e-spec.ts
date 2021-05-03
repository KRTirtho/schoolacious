import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { Server } from "http";
import {
  createJwtTokenFromHeader,
  createMockSchool,
  createMockUser,
  MockSchoolResponse,
  MockUserResponse,
} from "../e2e-test.util";
import InvitationJoinDTO from "../../src/invitation-join/dto/invitation-join.dto";
import {
  INVITATION_OR_JOIN_ROLE,
  INVITATION_OR_JOIN_TYPE,
} from "../../src/database/entity/invitations_or_joins.entity";
import { bootstrapApp } from "../e2e-test.util";
import { AppModule } from "../../src/app.module";

describe("InvitationJoinModule (e2e) PATH: /invitation-join", () => {
  let app: INestApplication;
  let server: Server;
  let client: request.SuperTest<request.Test>;
  const averageInvitation: InvitationJoinDTO = {
    role: INVITATION_OR_JOIN_ROLE.teacher,
    type: INVITATION_OR_JOIN_TYPE.invitation,
  };
  const averageJoin: InvitationJoinDTO = {
    role: INVITATION_OR_JOIN_ROLE.student,
    type: INVITATION_OR_JOIN_TYPE.join,
  };
  let school: MockSchoolResponse;
  let authorization: string;

  // mocks
  let invitationMockUser: MockUserResponse;
  let joinMockUser: MockUserResponse;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bootstrapApp(app);
    await app.init();
    server = app.getHttpServer();
    client = request(server);
    const schoolOwner = await createMockUser(client);
    school = await createMockSchool(
      client,
      `Bearer ${schoolOwner.headers["x-access-token"]}`
    );
    authorization = `Bearer ${schoolOwner.headers["x-access-token"]}`;

    // mocks
    invitationMockUser = await createMockUser(client);
    joinMockUser = await createMockUser(client);
    averageInvitation.user_id = invitationMockUser.body._id;
    // assigning the mock school as school for join mock user
    averageJoin.school_id = school.body._id;
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
  test("/ (POST) perfect join", async () => {
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", createJwtTokenFromHeader(joinMockUser))
      .send(averageJoin)
      .expect(HttpStatus.CREATED);

    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("role");
    expect(body).toHaveProperty("user");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("school");
    expect(body).toHaveProperty("created_at");

    expect(body.user._id).toEqual(joinMockUser.body._id);
    expect(body.school._id).toEqual(school.body._id);
  });
  test("/ (POST) invite without user_id", async () => {
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", authorization)
      .send({ ...averageInvitation, user_id: undefined })
      .expect(HttpStatus.FORBIDDEN);

    expect(body.message).toEqual("wrong credentials");
  });
  test("/ (POST) join without school_id", async () => {
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", createJwtTokenFromHeader(joinMockUser))
      .send({ ...averageJoin, school_id: undefined })
      .expect(HttpStatus.FORBIDDEN);

    expect(body.message).toEqual("wrong credentials");
  });
  test("/ (POST) invite with invalid user_id", async () => {
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", authorization)
      .send({
        ...averageInvitation,
        user_id: "d07eff54-7203-41e7-88a5-be358316557e",
      })
      .expect(HttpStatus.NOT_FOUND);

    expect(body.message).toEqual(
      "no user found with body: role=`teacher`, type=`invitation`, user_id=`d07eff54-7203-41e7-88a5-be358316557e`"
    );
  });
  test("/ (POST) join with invalid school_id", async () => {
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", createJwtTokenFromHeader(joinMockUser))
      .send({
        ...averageJoin,
        school_id: "d07eff54-7203-41e7-88a5-be358316557e",
      })
      .expect(HttpStatus.NOT_FOUND);
    expect(body.message).toEqual(
      "no school found with body: role=`student`, type=`join`, school_id=`d07eff54-7203-41e7-88a5-be358316557e`"
    );
  });
  test("/ (POST) inviting someone, already joined a school", async () => {
    const user = await createMockUser(client);
    await createMockSchool(client, createJwtTokenFromHeader(user));
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", authorization)
      .send({ ...averageInvitation, user_id: user.body._id })
      .expect(HttpStatus.NOT_ACCEPTABLE);

    expect(body.message).toEqual("user already has joined a school");
  });
  test("/ (POST) join while already being in a school", async () => {
    const user = await createMockUser(client);
    const mockSchool = await createMockSchool(
      client,
      createJwtTokenFromHeader(user)
    );
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", authorization)
      .send({ ...averageJoin, school_id: mockSchool.body._id })
      .expect(HttpStatus.NOT_ACCEPTABLE);

    expect(body.message).toEqual("user already has joined a school");
  });
  test("/ (POST) duplicate invitation", async () => {
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", authorization)
      .send(averageInvitation)
      .expect(HttpStatus.BAD_REQUEST);
    expect(body.message).toEqual(
      `Key (user_id, school_id)=(${averageInvitation.user_id}, ${school.body._id}) already exists.`
    );
  });
  test("/ (POST) duplicate join", async () => {
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", createJwtTokenFromHeader(joinMockUser))
      .send(averageJoin)
      .expect(HttpStatus.BAD_REQUEST);
    expect(body.message).toEqual(
      `Key (user_id, school_id)=(${joinMockUser.body._id}, ${school.body._id}) already exists.`
    );
  });
  // test("/ (POST) sending invitation from non-admin/co-admin user", () => {});
  test("/ (POST) sending invitation with school_id", async () => {
    const user = await createMockUser(client);
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", authorization)
      .send({
        ...averageInvitation,
        school_id: school.body._id,
        user_id: user.body._id,
      })
      .expect(HttpStatus.CREATED);

    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("role");
    expect(body).toHaveProperty("user");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("school");
    expect(body).toHaveProperty("created_at");

    expect(body.user._id).toEqual(user.body._id);
    expect(body.school._id).toEqual(school.body._id);
  });
  test("/ (POST) sending join with user_id", async () => {
    const user = await createMockUser(client);
    const { body } = await client
      .post("/invitation-join")
      .set("Authorization", createJwtTokenFromHeader(user))
      .send({ ...averageJoin, user_id: user.body._id })
      .expect(HttpStatus.CREATED);

    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("role");
    expect(body).toHaveProperty("user");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("school");
    expect(body).toHaveProperty("created_at");

    expect(body.user._id).toEqual(user.body._id);
    expect(body.school._id).toEqual(school.body._id);
  });

  test("/ (DELETE) perfect invitation cancel", async () => {
    const schoolInvitations = await client
      .get(`/school/${school.body.short_name}/invitations`)
      .set("Authorization", authorization);
    const { body } = await client
      .delete("/invitation-join")
      .set("Authorization", authorization)
      .send({ _id: schoolInvitations.body[0]._id })
      .expect(HttpStatus.OK);

    expect(body.message).toEqual("Cancelled invitation/join-request");
  });
  test("/ (DELETE) perfect join cancel", async () => {
    const token = createJwtTokenFromHeader(joinMockUser);
    const userJoin = await client
      .get(`/user/join-requests`)
      .set("Authorization", token);
    const { body } = await client
      .delete("/invitation-join")
      .set("Authorization", token)
      .send({ _id: userJoin.body[0]._id })
      .expect(HttpStatus.OK);

    expect(body.message).toEqual("Cancelled invitation/join-request");
  });
  test("/ (DELETE) without required field", async () => {
    const { body } = await client
      .delete("/invitation-join")
      .set("Authorization", authorization)
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toEqual([
      "_id should not be null or undefined",
      "_id must be a UUID",
    ]);
  });
  test("/ (DELETE) with invalid _id", async () => {
    const invalid_id = "45c60732-9eec-42a1-8a62-0da789ae7c40";
    const { body } = await client
      .delete("/invitation-join")
      .set("Authorization", authorization)
      .send({ _id: invalid_id })
      .expect(HttpStatus.NOT_FOUND);

    expect(body.message).toEqual(
      `no invitations_joins found with body: _id=\`${invalid_id}\``
    );
  });
  test("/ (DELETE) with wrong credentials", async () => {
    const schoolInvitations = await client
      .get(`/school/${school.body.short_name}/invitations`)
      .set("Authorization", authorization);
    const { body } = await client
      .delete("/invitation-join")
      .set("Authorization", createJwtTokenFromHeader(joinMockUser))
      .send({ _id: schoolInvitations.body[0]._id })
      .expect(HttpStatus.FORBIDDEN);

    expect(body.message).toEqual("wrong credentials");
  });
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
    await app.close();
  });
});
