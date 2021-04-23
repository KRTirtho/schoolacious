import { ValidationPipe } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { getRepository } from "typeorm";
import { AppModule } from "../../src/app.module";
import JwtAuthGuard from "../../src/auth/guards/jwt-auth.guard";
import RoleAuthGuard from "../../src/auth/guards/role-auth.guard";
import User from "../../src/database/entity/users.entity";

describe("(e2e) PATH: auth/", () => {
  let app: INestApplication;
  let server: Server;
  beforeAll(async () => {
    app = (
      await Test.createTestingModule({ imports: [AppModule] }).compile()
    ).createNestApplication();

    app.init();
    app.useGlobalPipes(new ValidationPipe());
    const reflector = new Reflector();
    const jwtAuthGuard = new JwtAuthGuard(reflector);
    const roleAuthGuard = new RoleAuthGuard(reflector);
    app.useGlobalGuards(jwtAuthGuard, roleAuthGuard);
    server = app.getHttpServer();
  });

  it("/signup (POST) perfect", async () => {
    const user = {
      email: "damn@damn.damn",
      password: "whatthepass",
      first_name: "I know",
      last_name: "I'm cool",
    };
    const res = await request(server)
      .post("/auth/signup")
      .send(user)
      .expect(201);
    expect(res.body).toHaveProperty("email", user.email);
    expect(res.body).not.toHaveProperty("password");
    expect(res.body).toHaveProperty("first_name", user.first_name);
    expect(res.body).toHaveProperty("last_name", user.last_name);
    expect(res.body).toHaveProperty("joined_on");
  });

  it("/signup (POST) without required fields", async () => {
    const user = { email: "come@on.org", first_name: "Cool" };
    const res = await request(server)
      .post("/auth/signup")
      .send(user)
      .expect(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBeInstanceOf(Array);
    expect(res.body.message).toEqual([
      "last_name should not be null or undefined",
      "last_name must be shorter than or equal to 50 characters",
      "last_name should not be empty",
      "password should not be null or undefined",
      "password must be longer than or equal to 8 characters",
      "password should not be empty",
    ]);
  });

  it("/signup (POST) with invalid email", async () => {
    const user = {
      email: "asdado",
      password: "whatthepass",
      first_name: "I know",
      last_name: "I'm cool",
    };
    const res = await request(server)
      .post("/auth/signup")
      .send(user)
      .expect(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBeInstanceOf(Array);
    expect(res.body.message).toContain("email must be an email");
  });

  it("/signup (POST) with already signed up user", async () => {
    const user = {
      email: "damn@damn.damn",
      password: "whatthepass",
      first_name: "I know",
      last_name: "I'm cool",
    };
    const res = await request(server)
      .post("/auth/signup")
      .send(user)
      .expect(406);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      `Key (email)=(${user.email}) already exists.`
    );
  });

  // it("/login (POST) perfect", () => {});

  // it("/login (POST) wrong password", () => {});

  // it("/login (POST) non-existing email", () => {});

  // it("/refresh (POST) perfect", () => {});

  // it("/refresh (POST) without x-refresh-token header", () => {});

  // it("/refresh (POST) with wrong refresh token", () => {});

  afterAll(async () => {
    await getRepository(User).delete({});
    await app.close();
  });
});
