import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserModule } from "../../src/user/user.module";

describe("UserModule (e2e) PATH: user/", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/invitations (GET) perfect", () => {});
  it("/join-requests (GET) perfect", () => {});

  afterAll(() => {
    app.close();
  });
});
