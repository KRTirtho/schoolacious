import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { bootstrapApp } from "../e2e-test.util";

describe("(e2e) PATH: /school/:school/grade", () => {
    let app: INestApplication;
    let server: Server;
    let client: request.SuperTest<request.Test>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        bootstrapApp(app);
        await app.init();
        server = app.getHttpServer();
        client = request(server);
    });

    test.todo("/ (POST) perfectly create grades");
    test.todo("/ (POST) with non-applicable user");
    test.todo("/ (POST) empty array");
    test.todo("/ (POST) wrong array elements");
    test.todo("/ (POST) co-admin auth");
    test.todo("/ (POST) duplicate");

    test.todo("/ (GET) perfectly get all grades");
    test.todo("/ (GET) with non-applicable user");

    test.todo("/:grade (GET) perfectly get a specific grade");
    test.todo("/:grade (GET) wrong grade");

    test.todo("/:grade/subject (POST) perfectly assign subjects");
    test.todo("/:grade/subject (POST) with non-applicable user");
    test.todo("/:grade/subject (POST) empty array");
    test.todo("/:grade/subject (POST) wrong array elements");
    test.todo("/:grade/subject (POST) co-admin auth");
    test.todo("/:grade/subject (POST) grade-moderator auth");
    test.todo("/:grade/subject (POST) put");

    test.todo("/:grade/assign-moderator (PUT) perfectly");
    test.todo("/:grade/assign-moderator (PUT) with non-applicable user");
    test.todo("/:grade/assign-moderator (PUT) no required fields");
    test.todo("/:grade/assign-moderator (PUT) wrong body");
    test.todo("/:grade/assign-moderator (PUT) already grade-moderator");

    test.todo("/:grade/assign-examiner (PUT) perfectly");
    test.todo("/:grade/assign-examiner (PUT) with non-applicable user");
    test.todo("/:grade/assign-examiner (PUT) no required fields");
    test.todo("/:grade/assign-examiner (PUT) wrong body");
    test.todo("/:grade/assign-examiner (PUT) already grade-examiner");

    afterAll(async () => {
        await app.close();
    });
});
