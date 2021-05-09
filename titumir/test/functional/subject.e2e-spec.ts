import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import CreateSubjectDTO from "../../src/subject/dto/create-subject.dto";
import defaultSubjects from "../../src/subject/static/default-subjects";
import {
  bootstrapApp,
  createJwtTokenFromHeader,
  createMockSchool,
  createMockUser,
  MockSchoolResponse,
} from "../e2e-test.util";

describe("(e2e) PATH: /school/:school/subject", () => {
  let app: INestApplication;
  let server: Server;
  let client: request.SuperTest<request.Test>;
  let school: MockSchoolResponse;
  let authorization: string;
  const subjects: CreateSubjectDTO[] = Array.from(
    { length: 10 },
    (_, index) => ({
      name: `Subject-${index}`,
      description: `The description of subject-${index}`,
    })
  );

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
    authorization = createJwtTokenFromHeader(admin);
    school = await createMockSchool(client, authorization);
  });

  test("/ (POST) create subject perfectly", async () => {
    let { body } = await client
      .post(`/school/${school.body.short_name}/subject`)
      .set("Authorization", authorization)
      .send(subjects)
      .expect(HttpStatus.CREATED);
    body = body.map(({ name, description }) => ({ name, description }));
    for (const subject of subjects) {
      expect(body).toContainEqual(subject);
    }
  });
  test("/ (POST) create subject without required fields", async () => {
    const { body } = await client
      .post(`/school/${school.body.short_name}/subject`)
      .set("Authorization", authorization)
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toEqual("Validation failed (parsable array expected)");
  });

  test("/ (GET) get all available subjects", async () => {
    let { body } = await client
      .get(`/school/${school.body.short_name}/subject`)
      .set("Authorization", authorization)
      .expect(HttpStatus.OK);

    body = body.map(({ name, description }) => ({ name, description }));
    for (const subject of subjects) {
      expect(body).toContainEqual(subject);
    }
  });
  test("/default (GET) get all default subjects", async () => {
    const { body } = await client
      .get(`/school/${school.body.short_name}/subject/defaults`)
      .set("Authorization", authorization)
      .expect(HttpStatus.OK);
    expect(body).toEqual(defaultSubjects);
  });

  afterAll(async () => {
    await app.close();
  });
});
