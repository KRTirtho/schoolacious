import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { Server } from "http";
import CreateSchoolDTO from "../../src/school/dto/create-school.dto";
import { getRepository } from "typeorm";
import User, { USER_ROLE } from "../../src/database/entity/users.entity";
import School from "../../src/database/entity/schools.entity";
import { AppModule } from "../../src/app.module";
import SignupDTO from "../../src/auth/dto/signup.dto";
import { bootstrapApp, signUpUser, SignUpUserReturns } from "../e2e-test.util";

export const averageSchool: Partial<CreateSchoolDTO> = {
  email: "dum@shksc.edu",
  description: "Its not a school come on",
  name: "Shamsul Haque Khan School & College",
  phone: "8801111111111",
  short_name: "shksc",
};

describe("(e2e) PATH: school/", () => {
  let app: INestApplication;
  let server: Server;
  let client: request.SuperTest<request.Test>;
  let authorization = "";
  let existingSchoolUser: SignUpUserReturns;

  const averageUser: Partial<SignupDTO> = {
    email: "fujiko_f_fujio@doraemon.anime",
    first_name: "Fujiko",
    last_name: "Fujio",
    password: "I created doraemon",
  };

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
    const signup = await signUpUser(client, averageUser as SignupDTO);

    authorization = `Bearer ${signup.headers["x-access-token"]}`;
  });

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
    existingSchoolUser = await signUpUser(client, {
      email: "wow@wow.how",
      first_name: "don",
      last_name: "is",
      password: "strongest password ever",
    });

    const { body } = await client
      .post("/school")
      .send(averageSchool)
      .set(
        "Authorization",
        `Bearer ${existingSchoolUser.headers["x-access-token"]}`
      )
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toEqual("Key (email)=(dum@shksc.edu) already exists.");
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
      .send(averageSchool)
      .expect(HttpStatus.BAD_REQUEST);

    expect(body.message).toEqual("User already has joined a school");
  });

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

    delete body.admin._id;
    delete body.admin.joined_on;
    expect(body.admin).toEqual({
      ...averageUser,
      role: USER_ROLE.admin,
      password: undefined,
    });

    delete body.admin;
    delete body._id;
    delete body.created_at;
    expect(body).toEqual(averageSchool);
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

  test("/:school/join-requests (GET) perfect", async () => {
    const { body } = await client
      .get(`/school/${averageSchool.short_name}`)
      .set("Authorization", authorization)
      .expect(HttpStatus.OK);
  });
  // test("/:school/join-requests (GET) with user (role) not permitted", () => {});
  // test("/:school/join-requests (GET) with outside user credentials", () => {});

  // test("/:school/invitations (GET) perfect", () => {});
  // test("/:school/invitations (GET) with user (role) not permitted", () => {});
  // test("/:school/invitations (GET) with outside user credentials", () => {});

  // test("/:school/co-admin (POST) perfect", () => {});
  // test("/:school/co-admin (POST) without required fields", () => {});
  // test("/:school/co-admin (POST) with wrong user_id", () => {});
  // test("/:school/co-admin (POST) with user (role) not permitted", () => {});
  // test("/:school/co-admin (POST) with outside user credentials", () => {});
  // test("/:school/co-admin (POST) with user who is already an co-admin", () => {});
  // test("/:school/co-admin (POST) with an outside user", () => {});
  // test("/:school/co-admin (POST) with an outside user", () => {});

  afterAll(async () => {
    const schoolRepo = getRepository(School);
    const userRepo = getRepository(User);
    const [school, user] = await Promise.all([
      schoolRepo.findOne({
        short_name: averageSchool.short_name,
      }),
      userRepo.findOne({ email: averageUser.email }),
    ]);
    school.admin = null;
    await schoolRepo.save(school);

    user.school = null;
    user.role = null;
    await userRepo.save(user);

    await Promise.all([
      schoolRepo.delete({ short_name: averageSchool.short_name }),
      userRepo.delete({ email: averageUser.email }),
      existingSchoolUser.clearUser(),
    ]);
    await app.close();
  });
});
