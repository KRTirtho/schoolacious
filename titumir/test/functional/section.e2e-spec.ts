import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { bootstrapApp } from "../e2e-test.util";

describe("(e2e) PATH: /school/:school/grade/:grade/section", () => {
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

    test.todo("/ (POST) perfectly create sections");
    test.todo("/ (POST) with non-applicable user");
    test.todo("/ (POST) empty array");
    test.todo("/ (POST) wrong array elements");
    test.todo("/ (POST) co-admin auth");
    test.todo("/ (POST) grade-moderator auth");
    test.todo("/ (POST) duplicate");

    test.todo("/ (GET) perfectly get all sections");
    test.todo("/ (GET) with non-applicable user");

    test.todo("/:section (GET) perfectly get a specific section");
    test.todo("/:section (GET) wrong or non-existing section");

    test.todo("/:section/class-teacher (PUT) perfectly");
    test.todo("/:section/class-teacher (PUT) with non-applicable user");
    test.todo("/:section/class-teacher (PUT) no required fields");
    test.todo("/:section/class-teacher (PUT) wrong body");
    test.todo("/:section/class-teacher (PUT) already class-teacher");

    test.todo("/:section/students (PUT) perfectly create students");
    test.todo("/:section/students (PUT) with non-applicable user");
    test.todo("/:section/students (PUT) empty array");
    test.todo("/:section/students (PUT) wrong array elements");
    test.todo("/:section/students (PUT) co-admin auth");
    test.todo("/:section/students (PUT) grade-moderator auth");
    test.todo("/:section/students (PUT) class-teacher auth");
    test.todo("/:section/students (PUT) duplicate");

    test.todo("/:section/teachers (POST) perfectly create teachers");
    test.todo("/:section/teachers (POST) with non-applicable user");
    test.todo("/:section/teachers (POST) empty array");
    test.todo("/:section/teachers (POST) wrong array elements");
    test.todo("/:section/teachers (POST) co-admin auth");
    test.todo("/:section/teachers (POST) grade-moderator auth");
    test.todo("/:section/teachers (POST) class-teacher auth");
    test.todo("/:section/teachers (POST) duplicate");

    test.todo("/:section/students (DELETE) perfectly");
    test.todo("/:section/students (DELETE) with non-applicable user");
    test.todo("/:section/students (DELETE) no required fields");
    test.todo("/:section/students (DELETE) wrong student");

    test.todo("/:section/teachers (DELETE) perfectly");
    test.todo("/:section/teachers (DELETE) with non-applicable user");
    test.todo("/:section/teachers (DELETE) no required fields");
    test.todo("/:section/teachers (DELETE) wrong teacher");
    test.todo("/:section/teachers (DELETE) wrong subject");

    afterAll(async () => {
        await app.close();
    });
});
