import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { getRepository } from "typeorm";
import User from "../../src/database/entity/users.entity";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getRepository(User).delete({});
  });

  it("/auth/signup (POST)", async () => {
    const user = {
      email: "damn@damn.damn",
      password: "whatthepass",
      first_name: "I know",
      last_name: "I'm cool",
    };
    const res = await request(app.getHttpServer())
      .post("/auth/signup")
      .send(user)
      .expect(201);
    expect(res.body).toHaveProperty("email", user.email);
    expect(res.body).not.toHaveProperty("password");
    expect(res.body).toHaveProperty("first_name", user.first_name);
    expect(res.body).toHaveProperty("last_name", user.last_name);
    expect(res.body).toHaveProperty("joined_on");
  });
});
