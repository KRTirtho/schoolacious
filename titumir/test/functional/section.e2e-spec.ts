import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { bootstrapApp } from "../e2e-test.util";

describe("(e2e) PATH: ", () => {
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
});
