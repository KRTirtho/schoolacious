import { HttpStatus } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { getRepository } from "typeorm";
import { AppModule } from "../../src/app.module";
import User from "../../src/database/entity/users.entity";
import { bootstrapApp } from "../e2e-test.util";

const averageUser = {
  email: "damn@damn.damn",
  password: "whatthepass",
  first_name: "I know",
  last_name: "I'm cool",
};

describe("(e2e) PATH: auth/", () => {
  let app: INestApplication;
  let server: Server;
  let client: request.SuperTest<request.Test>;

  beforeAll(async () => {
    app = (
      await Test.createTestingModule({ imports: [AppModule] }).compile()
    ).createNestApplication();
    bootstrapApp(app);
    await app.init();
    server = app.getHttpServer();
    client = request(server);
  });

  test("/signup (POST) perfect", async () => {
    const res = await client
      .post("/auth/signup")
      .send(averageUser)
      .expect(HttpStatus.CREATED);
    expect(res.body).toHaveProperty("email", averageUser.email);
    expect(res.body).not.toHaveProperty("password");
    expect(res.body).toHaveProperty("first_name", averageUser.first_name);
    expect(res.body).toHaveProperty("last_name", averageUser.last_name);
    expect(res.body).toHaveProperty("joined_on");
    expect(res.headers).toHaveProperty("x-access-token");
    expect(res.headers).toHaveProperty("x-refresh-token");
  });

  test("/signup (POST) without required fields", async () => {
    const user = { email: "come@on.org", first_name: "Cool" };
    const res = await client
      .post("/auth/signup")
      .send(user)
      .expect(HttpStatus.BAD_REQUEST);
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
    expect(res.headers).not.toHaveProperty("x-access-token");
    expect(res.headers).not.toHaveProperty("x-refresh-token");
  });

  test("/signup (POST) with invalid email", async () => {
    const user = {
      ...averageUser,
      email: "asdado",
    };
    const res = await client
      .post("/auth/signup")
      .send(user)
      .expect(HttpStatus.BAD_REQUEST);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBeInstanceOf(Array);
    expect(res.body.message).toContain("email must be an email");
    expect(res.headers).not.toHaveProperty("x-access-token");
    expect(res.headers).not.toHaveProperty("x-refresh-token");
  });

  test("/signup (POST) with already signed up user", async () => {
    const res = await client
      .post("/auth/signup")
      .send(averageUser)
      .expect(HttpStatus.NOT_ACCEPTABLE);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      `Key (email)=(${averageUser.email}) already exists.`
    );
    expect(res.headers).not.toHaveProperty("x-access-token");
    expect(res.headers).not.toHaveProperty("x-refresh-token");
  });

  test("/login (POST) perfect", async () => {
    const res = await client
      .post("/auth/login")
      .send(averageUser)
      .expect(HttpStatus.CREATED);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("first_name");
    expect(res.body).toHaveProperty("last_name");
    expect(res.body).toHaveProperty("role");
    expect(res.body).toHaveProperty("joined_on");

    expect(res.body).not.toHaveProperty("password");

    expect(res.body.first_name).toEqual(averageUser.first_name);
    expect(res.body.last_name).toEqual(averageUser.last_name);

    expect(res.headers).toHaveProperty("x-access-token");
    expect(res.headers).toHaveProperty("x-refresh-token");
  });

  test("/login (POST) wrong password", async () => {
    const res = await client
      .post("/auth/login")
      .send({ ...averageUser, password: "whatnotapssdasda34" })
      .expect(HttpStatus.BAD_REQUEST);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("wrong credentials");

    expect(res.headers).not.toHaveProperty("x-access-token");
    expect(res.headers).not.toHaveProperty("x-refresh-token");
  });

  test("/login (POST) non-existing email", async () => {
    const res = await client
      .post("/auth/login")
      .send({ ...averageUser, email: "nobody@noreply.fu" })
      .expect(HttpStatus.NOT_FOUND);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("user doesn't exist");

    expect(res.headers).not.toHaveProperty("x-access-token");
    expect(res.headers).not.toHaveProperty("x-refresh-token");
  });

  test("/refresh (POST) perfect", async () => {
    const loginRes = await client
      .post("/auth/login")
      .send(averageUser)
      .expect(HttpStatus.CREATED);
    expect(loginRes.headers).toHaveProperty("x-access-token");
    expect(loginRes.headers).toHaveProperty("x-refresh-token");
    const res = await client
      .post("/auth/refresh")
      .set("x-refresh-token", loginRes.header["x-refresh-token"])
      .expect(HttpStatus.CREATED);
    expect(res.body.message).toEqual("Refreshed access_token");

    expect(res.headers).toHaveProperty("x-access-token");
    expect(res.headers).toHaveProperty("x-refresh-token");
    expect(res.headers["x-refresh"]).not.toEqual(
      loginRes.headers["x-refresh-token"]
    );
  });

  test("/refresh (POST) without x-refresh-token header", async () => {
    const res = await client
      .post("/auth/refresh")
      .expect(HttpStatus.NOT_ACCEPTABLE);

    expect(res.body.message).toStrictEqual("refresh token not set");

    expect(res.headers).not.toHaveProperty("x-access-token");
    expect(res.headers).not.toHaveProperty("x-refresh-token");
  });

  test("/refresh (POST) with wrong refresh token", async () => {
    const res = await client
      .post("/auth/refresh")
      .set(
        "x-refresh-token",
        "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.O_Hud-xr0BkuIf7uypjVWqak4BA5B_6w3p58H5KvwHJQaUqmKlIjFq1tgduOzsOB"
      )
      .expect(HttpStatus.UNAUTHORIZED);
    expect(res.body.message).toStrictEqual("invalid signature");

    expect(res.headers).not.toHaveProperty("x-access-token");
    expect(res.headers).not.toHaveProperty("x-refresh-token");
  });

  afterAll(async () => {
    await getRepository(User).delete({ email: averageUser.email });
    await app.close();
  });
});
