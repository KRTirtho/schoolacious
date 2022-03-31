import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { Server } from "http";
import {
    createJwtTokenFromHeader,
    createMockCoAdmin,
    createMockInvitation,
    createMockJoin,
    createMockSchool,
    createMockUser,
    MockSchoolResponse,
    MockUserResponse,
    bootstrapApp,
} from "../e2e-test.util";
import InvitationJoinDTO from "../../src/invitation-join/dto/invitation-join.dto";
import { INVITATION_OR_JOIN_ROLE, INVITATION_OR_JOIN_TYPE } from "@schoolacious/types";

import { AppModule } from "../../src/app.module";
import { INVITATION_OR_JOIN_ACTION } from "../../src/invitation-join/invitation-join.service";

describe("InvitationJoinModule (e2e) PATH: /invitation-join", () => {
    let app: INestApplication;
    let server: Server;
    let client: request.SuperTest<request.Test>;
    const averageInvitation: InvitationJoinDTO = {
        role: INVITATION_OR_JOIN_ROLE.teacher,
        type: INVITATION_OR_JOIN_TYPE.invitation,
    };
    const averageJoin: InvitationJoinDTO = {
        role: INVITATION_OR_JOIN_ROLE.student,
        type: INVITATION_OR_JOIN_TYPE.join,
    };
    let school: MockSchoolResponse;
    let authorization: string;

    // mocks
    let coAdminAuth: string;
    let invitationMockUser: MockUserResponse;
    let joinMockUser: MockUserResponse;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        bootstrapApp(app);
        await app.init();
        server = app.getHttpServer();
        client = request(server);
        const schoolOwner = await createMockUser(client);
        school = await createMockSchool(
            client,
            `Bearer ${schoolOwner.headers["x-access-token"]}`,
        );
        authorization = `Bearer ${schoolOwner.headers["x-access-token"]}`;

        // mocks
        invitationMockUser = await createMockUser(client);
        joinMockUser = await createMockUser(client);
        averageInvitation.user_id = invitationMockUser.body._id;
        // assigning the mock school as school for join mock user
        averageJoin.school_id = school.body._id;
        const coAdmin = await createMockUser(client);
        await createMockCoAdmin(client, authorization, coAdmin);
        coAdminAuth = createJwtTokenFromHeader(coAdmin);
    });

    test("/ (POST) perfect invitation", async () => {
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send(averageInvitation)
            .expect(HttpStatus.CREATED);

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("role");
        expect(body).toHaveProperty("user");
        expect(body).toHaveProperty("type");
        expect(body).toHaveProperty("school");
        expect(body).toHaveProperty("created_at");

        expect(body.user._id).toEqual(averageInvitation.user_id);
        expect(body.school._id).toEqual(school.body._id);
    });
    test("/ (POST) perfect join", async () => {
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", createJwtTokenFromHeader(joinMockUser))
            .send(averageJoin)
            .expect(HttpStatus.CREATED);

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("role");
        expect(body).toHaveProperty("user");
        expect(body).toHaveProperty("type");
        expect(body).toHaveProperty("school");
        expect(body).toHaveProperty("created_at");

        expect(body.user._id).toEqual(joinMockUser.body._id);
        expect(body.school._id).toEqual(school.body._id);
    });
    test("/ (POST) invite without user_id", async () => {
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send({ ...averageInvitation, user_id: undefined })
            .expect(HttpStatus.FORBIDDEN);

        expect(body.message).toEqual("wrong credentials");
    });
    test("/ (POST) join without school_id", async () => {
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", createJwtTokenFromHeader(joinMockUser))
            .send({ ...averageJoin, school_id: undefined })
            .expect(HttpStatus.FORBIDDEN);

        expect(body.message).toEqual("wrong credentials");
    });
    test("/ (POST) invite with invalid user_id", async () => {
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send({
                ...averageInvitation,
                user_id: "d07eff54-7203-41e7-88a5-be358316557e",
            })
            .expect(HttpStatus.NOT_FOUND);

        expect(body.message).toEqual(
            "no user found with body: role=`teacher`, type=`invitation`, user_id=`d07eff54-7203-41e7-88a5-be358316557e`",
        );
    });
    test("/ (POST) join with invalid school_id", async () => {
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", createJwtTokenFromHeader(joinMockUser))
            .send({
                ...averageJoin,
                school_id: "d07eff54-7203-41e7-88a5-be358316557e",
            })
            .expect(HttpStatus.NOT_FOUND);
        expect(body.message).toEqual(
            "no school found with body: role=`student`, type=`join`, school_id=`d07eff54-7203-41e7-88a5-be358316557e`",
        );
    });
    test("/ (POST) inviting someone, already joined a school", async () => {
        const user = await createMockUser(client);
        await createMockSchool(client, createJwtTokenFromHeader(user));
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send({ ...averageInvitation, user_id: user.body._id })
            .expect(HttpStatus.NOT_ACCEPTABLE);

        expect(body.message).toEqual("user already has joined a school");
    });
    test("/ (POST) join while already being in a school", async () => {
        const user = await createMockUser(client);
        const mockSchool = await createMockSchool(client, createJwtTokenFromHeader(user));
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send({ ...averageJoin, school_id: mockSchool.body._id })
            .expect(HttpStatus.NOT_ACCEPTABLE);

        expect(body.message).toEqual("user already has joined a school");
    });
    test("/ (POST) duplicate invitation", async () => {
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send(averageInvitation)
            .expect(HttpStatus.BAD_REQUEST);
        expect(body.message).toEqual(
            `Key (user_id, school_id)=(${averageInvitation.user_id}, ${school.body._id}) already exists.`,
        );
    });
    test("/ (POST) duplicate join", async () => {
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", createJwtTokenFromHeader(joinMockUser))
            .send(averageJoin)
            .expect(HttpStatus.BAD_REQUEST);
        expect(body.message).toEqual(
            `Key (user_id, school_id)=(${joinMockUser.body._id}, ${school.body._id}) already exists.`,
        );
    });

    test("/ (POST) sending invitation from non-admin/co-admin user", async () => {
        const user = await createMockUser(client);
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", coAdminAuth)
            .send({ ...averageInvitation, user_id: user.body._id })
            .expect(HttpStatus.CREATED);

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("role");
        expect(body).toHaveProperty("user");
        expect(body).toHaveProperty("type");
        expect(body).toHaveProperty("school");
        expect(body).toHaveProperty("created_at");

        expect(body.user._id).toEqual(user.body._id);
        expect(body.school._id).toEqual(school.body._id);
    });

    test("/ (POST) sending invitation with school_id", async () => {
        const user = await createMockUser(client);
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send({
                ...averageInvitation,
                school_id: school.body._id,
                user_id: user.body._id,
            })
            .expect(HttpStatus.CREATED);

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("role");
        expect(body).toHaveProperty("user");
        expect(body).toHaveProperty("type");
        expect(body).toHaveProperty("school");
        expect(body).toHaveProperty("created_at");

        expect(body.user._id).toEqual(user.body._id);
        expect(body.school._id).toEqual(school.body._id);
    });
    test("/ (POST) sending join with user_id", async () => {
        const user = await createMockUser(client);
        const { body } = await client
            .post("/invitation-join")
            .set("Authorization", createJwtTokenFromHeader(user))
            .send({ ...averageJoin, user_id: user.body._id })
            .expect(HttpStatus.CREATED);

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("role");
        expect(body).toHaveProperty("user");
        expect(body).toHaveProperty("type");
        expect(body).toHaveProperty("school");
        expect(body).toHaveProperty("created_at");

        expect(body.user._id).toEqual(user.body._id);
        expect(body.school._id).toEqual(school.body._id);
    });

    test("/ (DELETE) perfect invitation cancel", async () => {
        const schoolInvitations = await client
            .get(`/school/${school.body.short_name}/invitations`)
            .set("Authorization", authorization);
        const { body } = await client
            .delete("/invitation-join")
            .set("Authorization", authorization)
            .send({ _id: schoolInvitations.body[0]._id })
            .expect(HttpStatus.OK);

        expect(body.message).toEqual("Cancelled invitation/join-request");
    });
    test("/ (DELETE) perfect join cancel", async () => {
        const token = createJwtTokenFromHeader(joinMockUser);
        const userJoin = await client
            .get(`/user/join-requests`)
            .set("Authorization", token);
        const { body } = await client
            .delete("/invitation-join")
            .set("Authorization", token)
            .send({ _id: userJoin.body[0]._id })
            .expect(HttpStatus.OK);

        expect(body.message).toEqual("Cancelled invitation/join-request");
    });
    test("/ (DELETE) without required field", async () => {
        const { body } = await client
            .delete("/invitation-join")
            .set("Authorization", authorization)
            .expect(HttpStatus.BAD_REQUEST);

        expect(body.message).toEqual([
            "_id should not be null or undefined",
            "_id must be a UUID",
        ]);
    });
    test("/ (DELETE) with invalid _id", async () => {
        const invalid_id = "45c60732-9eec-42a1-8a62-0da789ae7c40";
        const { body } = await client
            .delete("/invitation-join")
            .set("Authorization", authorization)
            .send({ _id: invalid_id })
            .expect(HttpStatus.NOT_FOUND);

        expect(body.message).toEqual(
            `no invitations_joins found with body: _id=\`${invalid_id}\``,
        );
    });
    test("/ (DELETE) with wrong credentials", async () => {
        const schoolInvitations = await client
            .get(`/school/${school.body.short_name}/invitations`)
            .set("Authorization", authorization);
        const { body } = await client
            .delete("/invitation-join")
            .set("Authorization", createJwtTokenFromHeader(joinMockUser))
            .send({ _id: schoolInvitations.body[0]._id })
            .expect(HttpStatus.FORBIDDEN);

        expect(body.message).toEqual("wrong credentials");
    });
    test("/ (DELETE) cancel invitation from non-admin/co-admin user", async () => {
        await createMockInvitation(client, coAdminAuth, undefined, true);
        const schoolInvitations = await client
            .get(`/school/${school.body.short_name}/invitations`)
            .set("Authorization", coAdminAuth);
        const { body } = await client
            .delete("/invitation-join")
            .set("Authorization", coAdminAuth)
            .send({ _id: schoolInvitations.body[0]._id })
            .expect(HttpStatus.OK);

        expect(body.message).toEqual("Cancelled invitation/join-request");
    });

    test("/complete (POST) without required fields", async () => {
        const { body } = await client
            .post("/invitation-join/complete")
            .set("Authorization", createJwtTokenFromHeader(invitationMockUser))
            .expect(HttpStatus.BAD_REQUEST);

        expect(body.message).toEqual([
            "_id should not be null or undefined",
            "_id must be a UUID",
            "action should not be null or undefined",
            "action must be a valid enum value",
        ]);
    });
    test("/complete (POST) with invalid _id", async () => {
        const invalid_id = "12fb4244-9db3-49ce-a13d-7d0b3d42b98d";
        const { body } = await client
            .post("/invitation-join/complete")
            .send({
                _id: invalid_id,
                action: INVITATION_OR_JOIN_ACTION.reject,
            })
            .set("Authorization", createJwtTokenFromHeader(invitationMockUser))
            .expect(HttpStatus.NOT_FOUND);

        expect(body.message).toEqual(
            `no invitations_joins found with body: _id=\`${invalid_id}\`, action=\`reject\``,
        );
    });

    test("/complete (POST) accept wrong credentials", async () => {
        const userInvitation = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send(averageInvitation);
        const { body } = await client
            .post("/invitation-join/complete")
            .send({
                _id: userInvitation.body._id,
                action: INVITATION_OR_JOIN_ACTION.reject,
            })
            .set("Authorization", createJwtTokenFromHeader(joinMockUser))
            .expect(HttpStatus.FORBIDDEN);

        expect(body.message).toEqual("wrong credentials");
    });

    test("/complete (POST) reject perfect invitation complete", async () => {
        const {
            body: [userInvitation],
        } = await client
            .get("/user/invitations")
            .set("Authorization", createJwtTokenFromHeader(invitationMockUser))
            .expect(HttpStatus.OK);
        const { body } = await client
            .post("/invitation-join/complete")
            .send({
                _id: userInvitation._id,
                action: INVITATION_OR_JOIN_ACTION.reject,
            })
            .set("Authorization", createJwtTokenFromHeader(invitationMockUser));

        expect(body.message).toEqual("rejected invitation/join");
    });

    test("/complete (POST) accept perfect invitation complete", async () => {
        const userInvitation = await client
            .post("/invitation-join")
            .set("Authorization", authorization)
            .send(averageInvitation);
        const { body } = await client
            .post("/invitation-join/complete")
            .send({
                _id: userInvitation.body._id,
                action: INVITATION_OR_JOIN_ACTION.accept,
            })
            .set("Authorization", createJwtTokenFromHeader(invitationMockUser))
            .expect(HttpStatus.CREATED);

        expect(body.message).toEqual("accepted invitation/join");
    });

    test("/complete (POST) accept when user already joined a school meanwhile", async () => {
        // creating the admin users
        const admin = await createMockUser(client);
        const user = await createMockUser(client);

        const mockSchool2Auth = createJwtTokenFromHeader(admin);
        // creating the secondary mock school
        await createMockSchool(client, mockSchool2Auth);
        // sending invitation to user from both mock schools
        const invite = (auth: string) =>
            client
                .post("/invitation-join")
                .send({ ...averageInvitation, user_id: user.body._id })
                .set("Authorization", auth);

        const invitation1 = await invite(authorization);
        const invitation2 = await invite(mockSchool2Auth);

        const accept = (invitation: request.Response) =>
            client
                .post("/invitation-join/complete")
                .send({
                    _id: invitation.body._id,
                    action: INVITATION_OR_JOIN_ACTION.accept,
                })
                .set("Authorization", createJwtTokenFromHeader(user));
        // accepting the first invitation
        await accept(invitation1).expect(HttpStatus.CREATED);

        const { body } = await accept(invitation2).expect(HttpStatus.NOT_ACCEPTABLE);
        expect(body.message).toEqual("user already has a school meanwhile");
    });

    test("/complete (POST) accept a join with not admin/co-admin user", async () => {
        const user = await createMockUser(client);
        const joinRequest = await createMockJoin(
            client,
            createJwtTokenFromHeader(user),
            school,
        );

        const { body } = await client
            .post("/invitation-join/complete")
            .send({
                _id: joinRequest.body._id,
                action: INVITATION_OR_JOIN_ACTION.accept,
            })
            .set("Authorization", coAdminAuth)
            .expect(HttpStatus.CREATED);

        expect(body.message).toEqual("accepted invitation/join");
    });

    test("/complete (POST) reject perfect join complete", async () => {
        const {
            body: [joinRequest],
        } = await client
            .get(`/school/${school.body.short_name}/join-requests`)
            .set("Authorization", authorization)
            .expect(HttpStatus.OK);

        const { body } = await client
            .post("/invitation-join/complete")
            .send({
                _id: joinRequest._id,
                action: INVITATION_OR_JOIN_ACTION.reject,
            })
            .set("Authorization", authorization)
            .expect(HttpStatus.CREATED);

        expect(body.message).toEqual("rejected invitation/join");
    });

    test("/complete (POST) accept perfect join complete", async () => {
        const joinRequest = await createMockJoin(
            client,
            createJwtTokenFromHeader(joinMockUser),
            school,
        );
        const { body } = await client
            .post("/invitation-join/complete")
            .send({
                _id: joinRequest.body._id,
                action: INVITATION_OR_JOIN_ACTION.accept,
            })
            .set("Authorization", authorization)
            .expect(HttpStatus.CREATED);

        expect(body.message).toEqual("accepted invitation/join");
    });

    afterAll(async () => {
        await app.close();
    });
});
