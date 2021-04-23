import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SchoolModule } from "../../src/school/school.module";
import request from "supertest";

describe("(e2e) PATH: school/", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SchoolModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (POST) perfect", async () => {
    request(app.getHttpServer()).post("/school")
  });
  it("/ (POST) with exiting school", () => {});
  it("/ (POST) with missing required fields", () => {});
  it("/ (POST) with one who already joined a school", () => {});

  it("/:school (GET) perfect", () => {});
  it("/:school (GET) non-existing school", () => {});

  it("/:school/join-requests (GET) perfect", () => {});
  it("/:school/join-requests (GET) with user (role) not permitted", () => {});
  it("/:school/join-requests (GET) with outside user credentials", () => {});

  it("/:school/invitations (GET) perfect", () => {});
  it("/:school/invitations (GET) with user (role) not permitted", () => {});
  it("/:school/invitations (GET) with outside user credentials", () => {});

  it("/:school/co-admin (POST) perfect", () => {});
  it("/:school/co-admin (POST) without required fields", () => {});
  it("/:school/co-admin (POST) with wrong user_id", () => {});
  it("/:school/co-admin (POST) with user (role) not permitted", () => {});
  it("/:school/co-admin (POST) with outside user credentials", () => {});
  it("/:school/co-admin (POST) with user who is already an co-admin", () => {});
  it("/:school/co-admin (POST) with an outside user", () => {});
  it("/:school/co-admin (POST) with an outside user", () => {});

  afterAll(() => {
    app.close();
  });
});
