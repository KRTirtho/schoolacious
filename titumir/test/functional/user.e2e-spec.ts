import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import {
  bootstrapApp,
  createJwtTokenFromHeader,
  createMockInvitation,
  createMockJoin,
  createMockSchool,
  createMockUser,
  MockSchoolResponse,
  MockUserResponse,
} from "../e2e-test.util";

describe("(e2e) PATH: /user", () => {
  let app: INestApplication;
  let server: Server;
  let client: request.SuperTest<request.Test>;
  let mockUser: MockUserResponse;
  let school: MockSchoolResponse;
  let adminAuth: string;
  let userAuth: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    bootstrapApp(app);
    await app.init();
    server = app.getHttpServer();
    client = request(server);
    const admin = await createMockUser(client);
    adminAuth = createJwtTokenFromHeader(admin);
    school = await createMockSchool(client, adminAuth);
    mockUser = await createMockUser(client);
    userAuth = createJwtTokenFromHeader(mockUser);
  });

  test("/invitations (GET) perfect", async () => {
    const invitation = await createMockInvitation(client, adminAuth, mockUser);
    const { body } = await client
      .get("/user/invitations")
      .set("Authorization", userAuth)
      .expect(HttpStatus.OK);

    delete invitation.body.user;
    expect(body).toBeInstanceOf(Array);
    expect(body).toContainEqual(invitation.body);
  });

  test("/join-requests (GET) perfect", async () => {
    const user = await createMockUser(client);
    const joinReq = await createMockJoin(
      client,
      createJwtTokenFromHeader(user),
      school
    );

    const { body } = await client
      .get("/user/join-requests")
      .set("Authorization", createJwtTokenFromHeader(user))
      .expect(HttpStatus.OK);

    delete joinReq.body.user;
    expect(body).toBeInstanceOf(Array);
    expect(body).toContainEqual(joinReq.body);
  });

  afterAll(() => {
    app.close();
  });
});
