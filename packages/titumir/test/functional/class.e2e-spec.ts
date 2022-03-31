import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { bootstrapApp } from "../e2e-test.util";

describe("(e2e) PATH: /school/:school/grade/:grade/class", () => {
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

    afterAll(async () => {
        await app.close();
    });

    test.todo("/ (POST) perfect classes creation");
    test.todo("/ (POST) non-belonging host");
    test.todo("/ (POST) without required fields");
    test.todo("/ (POST) more than 6 class in a day");
    test.todo("/ (POST) lower than minimum break duration for host");
    test.todo("/ (POST) lower than minimum break duration for student");
    test.todo("/ (POST) duration higher than 1hr");
});
