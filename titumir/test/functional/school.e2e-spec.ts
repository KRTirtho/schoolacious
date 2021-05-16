import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { Server } from "http";
import CreateSchoolDTO from "../../src/school/dto/create-school.dto";
import { USER_ROLE } from "../../src/database/entity/users.entity";
import { AppModule } from "../../src/app.module";
import SignupDTO from "../../src/auth/dto/signup.dto";
import {
  bootstrapApp,
  completeMockInvitationJoin,
  createJwtTokenFromHeader,
  createMockInvitation,
  createMockJoin,
  createMockUser,
  generateMockSchool,
  generateMockUser,
  MockUserResponse,
} from "../e2e-test.util";
import AddCoAdminDTO from "../../src/school/dto/add-co-admin.dto";

export const averageSchool: Partial<CreateSchoolDTO> = generateMockSchool();

describe("(e2e) PATH: school/", () => {
  let app: INestApplication;
  let server: Server;
  let client: request.SuperTest<request.Test>;
  let authorization = "";
  let regularMember: MockUserResponse;

  const averageUser: SignupDTO = generateMockUser();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bootstrapApp(app);
    await app.init();
    server = app.getHttpServer();
    client = request(server);

    // login with the averageUser
    const admin = await createMockUser(client, averageUser);

    authorization = `Bearer ${admin.headers["x-access-token"]}`;
  });

  // School creation, crud in ("/school")
  test("/ (POST) perfect", async () => {
    const { body } = await client
      .post("/school")
      .set("Authorization", authorization)
      .send(averageSchool)
      .expect(HttpStatus.CREATED);

    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("short_name");
    expect(body).toHaveProperty("description");
    expect(body).toHaveProperty("admin");
    expect(body).toHaveProperty("phone");
    expect(body).toHaveProperty("created_at");

    delete body.admin;
    delete body._id;
    delete body.created_at;
    expect(body).toEqual(averageSchool);
  });
  test("/ (POST) with existing school", async () => {
    const mockUser = await createMockUser(client);

    const { body } = await client
      .post("/school")
      .send(averageSchool)
      .set("Authorization", `Bearer ${mockUser.headers["x-access-token"]}`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toEqual(
      `Key (short_name)=(${averageSchool.short_name}) already exists.`
    );
  });
  test("/ (POST) with missing required fields", async () => {
    const { body } = await client
      .post("/school")
      .set("Authorization", authorization)
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toBeInstanceOf(Array);
    expect(body.message).toEqual([
      "name should not be null or undefined",
      "name should not be empty",
      "email should not be null or undefined",
      "email must be an email",
      "phone should not be null or undefined",
      "phone must be a phone number",
      "description should not be null or undefined",
      "description should not be empty",
      "short_name should not be null or undefined",
      "short_name must match /\\w*\\d*-*/g regular expression",
      "short_name must be shorter than or equal to 20 characters",
      "short_name should not be empty",
      "short_name must be a lowercase string",
    ]);
  });
  test("/ (POST) with one who already joined a school", async () => {
    const { body } = await client
      .post("/school")
      .set("Authorization", authorization)
      .send(generateMockSchool())
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toEqual("user already has joined a school");
  });

  // School operations, crud in ("/school/:school")
  test("/:school (GET) perfect", async () => {
    const { body } = await client
      .get(`/school/${averageSchool.short_name}`)
      .set("Authorization", authorization)
      .expect(HttpStatus.OK);

    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("short_name");
    expect(body).toHaveProperty("description");
    expect(body).toHaveProperty("admin");
    expect(body).toHaveProperty("phone");
    expect(body).toHaveProperty("created_at");
    expect(body).toHaveProperty("coAdmin1");
    expect(body).toHaveProperty("coAdmin2");

    delete body.admin._id;
    delete body.admin.joined_on;
    delete (averageUser as any).password;
    expect(body.admin).toEqual({
      ...averageUser,
      role: USER_ROLE.admin,
    });

    delete body.admin;
    delete body._id;
    delete body.created_at;
    expect(body).toEqual({ ...averageSchool, coAdmin1: null, coAdmin2: null });
  });
  test("/:school (GET) non-existing school", async () => {
    const { body } = await client
      .get(`/school/dum-school`)
      .set("Authorization", authorization)
      .expect(HttpStatus.NOT_FOUND);

    expect(body.message).toEqual(
      "no school found with params: school=`dum-school`"
    );
  });

  // join operations of school, crud in ("/school/:school/join-requests")
  test("/:school/join-requests (GET) perfect", async () => {
    const users = [await createMockUser(client), await createMockUser(client)];
    const school = await client
      .get(`/school/${averageSchool.short_name}`)
      .set("Authorization", authorization)
      .expect(HttpStatus.OK);

    const joins = [
      await createMockJoin(client, createJwtTokenFromHeader(users[0]), school),
      await createMockJoin(client, createJwtTokenFromHeader(users[1]), school),
    ].map(({ body }) => {
      return {
        ...body,
        user: { ...body.user, school: undefined },
        school: undefined,
      };
    });
    const { body } = await client
      .get(`/school/${averageSchool.short_name}/join-requests`)
      .set("Authorization", authorization)
      .expect(HttpStatus.OK);

    expect(body).toBeInstanceOf(Array);
    expect(body).toContainEqual(joins[0]);
    expect(body).toContainEqual(joins[1]);
  });

  test("/:school/join-requests (GET) with user (role) not permitted", async () => {
    regularMember = await createMockUser(client);
    const invitation = await createMockInvitation(
      client,
      authorization,
      regularMember
    );
    await completeMockInvitationJoin(
      client,
      invitation,
      createJwtTokenFromHeader(regularMember)
    );
    const { body } = await client
      .get(`/school/${averageSchool.short_name}/join-requests`)
      .set("Authorization", createJwtTokenFromHeader(regularMember))
      .expect(HttpStatus.FORBIDDEN);
    expect(body.message).toEqual("Forbidden resource");
  });

  // join operations of school, crud in ("/school/:school/join-requests")
  test("/:school/invitations (GET) perfect", async () => {
    const users = [await createMockUser(client), await createMockUser(client)];

    const invitations = [
      await createMockInvitation(client, authorization, users[0]),
      await createMockInvitation(client, authorization, users[1]),
    ].map(({ body }) => {
      return {
        ...body,
        user: { ...body.user, school: undefined },
        school: undefined,
      };
    });

    const { body } = await client
      .get(`/school/${averageSchool.short_name}/invitations`)
      .set("Authorization", authorization)
      .expect(HttpStatus.OK);

    expect(body).toBeInstanceOf(Array);
    expect(body).toContainEqual(invitations[0]);
    expect(body).toContainEqual(invitations[1]);
  });
  test("/:school/invitations (GET) with user (role) not permitted", async () => {
    const { body } = await client
      .get(`/school/${averageSchool.short_name}/invitations`)
      .set("Authorization", createJwtTokenFromHeader(regularMember))
      .expect(HttpStatus.FORBIDDEN);
    expect(body.message).toEqual("Forbidden resource");
  });

  // co-admin assign operations of school
  // crud in ("/school/:school/co-admin")
  test("/:school/co-admin (POST) perfect", async () => {
    const payload: AddCoAdminDTO = {
      user_id: regularMember.body._id,
      index: 1,
    };
    const { body } = await client
      .put(`/school/${averageSchool.short_name}/co-admin`)
      .send(payload)
      .set("Authorization", authorization)
      .expect(HttpStatus.OK);

    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("short_name");
    expect(body).toHaveProperty("description");
    expect(body).toHaveProperty("phone");
    expect(body).toHaveProperty("created_at");
    expect(body).toHaveProperty("coAdmin1");
  });
  test("/:school/co-admin (POST) without required fields", async () => {
    const { body } = await client
      .put(`/school/${averageSchool.short_name}/co-admin`)
      .set("Authorization", authorization)
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toEqual([
      "index should not be null or undefined",
      "index must be a positive number",
      "index must be a number conforming to the specified constraints",
      "user_id should not be null or undefined",
      "user_id must be a UUID",
      "user_id should not be empty",
    ]);
  });
  test("/:school/co-admin (POST) with invalid user_id", async () => {
    const payload: AddCoAdminDTO = {
      user_id: "560ed590-ba0d-45a4-9a07-cfe18c1fe20f",
      index: 1,
    };
    const { body } = await client
      .put(`/school/${averageSchool.short_name}/co-admin`)
      .send(payload)
      .set("Authorization", authorization)
      .expect(HttpStatus.NOT_FOUND);

    expect(body.message).toEqual(
      `no user found with params: school=\`${averageSchool.short_name}\` body: user_id=\`${payload.user_id}\`, index=\`${payload.index}\``
    );
  });

  test("/:school/co-admin (POST) with user (role) not permitted", async () => {
    const payload: AddCoAdminDTO = {
      user_id: regularMember.body._id,
      index: 1,
    };
    const { body } = await client
      .put(`/school/${averageSchool.short_name}/co-admin`)
      .send(payload)
      .set("Authorization", createJwtTokenFromHeader(regularMember))
      .expect(HttpStatus.FORBIDDEN);

    expect(body.message).toEqual("Forbidden resource");
  });
  test("/:school/co-admin (POST) with user_id out of school", async () => {
    const user = await createMockUser(client);
    const payload: AddCoAdminDTO = {
      user_id: user.body._id,
      index: 1,
    };
    const { body } = await client
      .put(`/school/${averageSchool.short_name}/co-admin`)
      .send(payload)
      .set("Authorization", authorization)
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toEqual("user doesn't belong to same school");
  });
  test("/:school/co-admin (POST) with user who is already an co-admin", async () => {
    const payload: AddCoAdminDTO = {
      user_id: regularMember.body._id,
      index: 1,
    };
    const { body } = await client
      .put(`/school/${averageSchool.short_name}/co-admin`)
      .send(payload)
      .set("Authorization", authorization)
      .expect(HttpStatus.NOT_ACCEPTABLE);

    expect(body.message).toEqual(
      "user already is a co-admin. Cannot assign twice"
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
