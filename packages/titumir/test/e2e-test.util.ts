import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import SignupDTO from "../src/auth/dto/signup.dto";
import RoleAuthGuard from "../src/auth/guards/role-auth.guard";
import User from "../src/database/entity/users.entity";
import request from "supertest";
import CreateSchoolDTO from "../src/school/dto/create-school.dto";
import School from "../src/database/entity/schools.entity";
import { EntityNotFoundFilter } from "../src/database/filters/entity-not-found.filter";
import { QueryFailedFilter } from "../src/database/filters/query-failed.filter";
import { AppModule, JWT_AUTH_GUARD } from "../src/app.module";
import Invitations_Joins from "../src/database/entity/invitations_or_joins.entity";
import { INVITATION_OR_JOIN_ROLE, INVITATION_OR_JOIN_TYPE } from "@veschool/types";
import InvitationJoinDTO from "../src/invitation-join/dto/invitation-join.dto";
import { INVITATION_OR_JOIN_ACTION } from "../src/invitation-join/invitation-join.service";
import AddCoAdminDTO from "../src/school/dto/add-co-admin.dto";
import chalk from "chalk";

export function bootstrapApp(app: INestApplication) {
    app.useGlobalFilters(new QueryFailedFilter(), new EntityNotFoundFilter());
    app.useGlobalPipes(new ValidationPipe());
    const reflector = new Reflector();
    const jwtAuthGuard = app.select(AppModule).get(JWT_AUTH_GUARD);
    const roleAuthGuard = new RoleAuthGuard(reflector);
    app.useGlobalGuards(jwtAuthGuard, roleAuthGuard);
}

export const uStr = (from = 7) => Date.now().toString().substr(from);

function errorOut(instance: CallableFunction, error: any, prefix = "[End To End]") {
    console.error(
        chalk.red(prefix),
        "  -  ",
        chalk.yellow(instance.name),
        "  -  ",
        chalk.red(typeof error === "object" ? JSON.stringify(error, null, 2) : error),
    );
}

// create mocks

/**
 * Generates a mock user object which can be used with `creatMockUser`
 */
export function generateMockUser(): SignupDTO {
    return {
        email: `user-${uStr()}@fokir.com`,
        first_name: `random${uStr()}`,
        last_name: `fandom${uStr()}`,
        password: "tumi ki jano amar password?",
    };
}
export type MockUserResponse = Omit<request.Response, "body"> & {
    body: Pick<User, "_id" | "email" | "first_name" | "last_name" | "joined_on">;
};

/**
 * creates a mock user using the api & returns the response*
 * @param {Client} client - the http client
 * @param {SignupDTO} [payload] - optional payload which will be used
 * instead of `generateMockUser`
 */
export async function createMockUser(
    client: Client,
    payload?: SignupDTO,
): Promise<MockUserResponse> {
    try {
        if (!payload) payload = generateMockUser();

        const user: MockUserResponse = await client.post("/auth/signup").send(payload);
        return user;
    } catch (error) {
        errorOut(createMockUser, error);
        throw error;
    }
}

/**
 * Generates a mock school object which completely new & unique
 * it can be used with `createMockSchool` as optional payload
 */
export function generateMockSchool(): CreateSchoolDTO {
    return {
        email: `school-${uStr()}@failure.com`,
        description: "Lorem ipsum dolor emit".repeat(5),
        name: `${uStr()} School & Failure`,
        phone: uStr(2),
        short_name: `school-${uStr()}`,
    };
}

export type MockSchoolResponse = Omit<request.Response, "body"> & {
    body: Pick<
        School,
        | "_id"
        | "email"
        | "admin"
        | "created_at"
        | "description"
        | "name"
        | "phone"
        | "short_name"
        | "coAdmin1"
        | "coAdmin2"
    >;
};
type Client = request.SuperTest<request.Test>;

/**
 * creates a mock school using the api & returns it as the `response`
 * @param {Client} client - http client
 * @param {string} authorization - bearer token string used with the
 * `Authorization` header
 * @param {CreateSchoolDTO} [payload] - optional payload
 */
export async function createMockSchool(
    client: Client,
    authorization: string,
    payload?: CreateSchoolDTO,
): Promise<MockSchoolResponse> {
    try {
        if (!payload) payload = generateMockSchool();

        const school: MockSchoolResponse = await client
            .post("/school")
            .set("Authorization", authorization)
            .send(payload);
        return school;
    } catch (error) {
        errorOut(createMockSchool, error);
        throw error;
    }
}

/**
 * Sends invitation to a user & returns the response
 * @param {Client} client - http client
 * @param {string} auth - bearer token used with the `Authorization` header
 * @param {MockUserResponse} [user] - the user who will be invited
 * @param [createNewUser=false] - decides if automatically
 * should create a mock user & invite it
 */
export async function createMockInvitation(
    client: Client,
    auth: string,
    user?: MockUserResponse,
    createNewUser = false,
): Promise<MockInvitationJoinResponse> {
    try {
        if (createNewUser) {
            user = await createMockUser(client);
        } else if (!createNewUser && !user)
            throw new TypeError(
                "`user` can't be `undefined` when `createNewUser` is disabled",
            );
        const payload: InvitationJoinDTO = {
            role: INVITATION_OR_JOIN_ROLE.teacher,
            type: INVITATION_OR_JOIN_TYPE.invitation,
            user_id: user?.body._id,
        };
        return await client
            .post("/invitation-join")
            .set("Authorization", auth)
            .send(payload);
    } catch (error) {
        errorOut(createMockInvitation, error);
        throw error;
    }
}

export type MockInvitationJoinResponse = Omit<request.Response, "body"> & {
    body: Invitations_Joins;
};

/**
 * Sends join requests to the provided school & returns the response
 * @param {Client} client - http client
 * @param {string} auth - bearer token used with the `Authorization` header
 * @param {MockSchoolResponse} [school] - the school to which the request
 * of join will be send
 * @param [createNewSchool=false] - decides if automatically
 * should create a mock school & send join request to it
 */
export async function createMockJoin(
    client: Client,
    auth: string,
    school?: MockSchoolResponse,
    createNewSchool = false,
): Promise<MockInvitationJoinResponse> {
    try {
        if (createNewSchool) {
            const admin = await createMockUser(client);
            school = await createMockSchool(client, createJwtTokenFromHeader(admin));
        } else if (!createNewSchool && !school)
            throw new TypeError(
                "`school` can't be `undefined` when `createNewSchool` is disabled",
            );
        const payload: InvitationJoinDTO = {
            role: INVITATION_OR_JOIN_ROLE.teacher,
            type: INVITATION_OR_JOIN_TYPE.join,
            school_id: school?.body._id,
        };
        const res = await client
            .post("/invitation-join")
            .set("Authorization", auth)
            .send(payload);
        return res;
    } catch (error) {
        errorOut(createMockJoin, error);
        throw error;
    }
}

/**
 * completes a invitation/join with the provided invitation _id
 * @param {Client} client - http client
 * @param {(MockInvitationJoinResponse | string)} invitation - the
 * invitation/invitation_id which will completed
 * @param {string} authorization - bearer token used with the `Authorization` header
 * @param [action=INVITATION_OR_JOIN_ACTION.accept] - decides if invitations should be `accept`ed or `reject`ed
 */
export function completeMockInvitationJoin(
    client: Client,
    invitation: MockInvitationJoinResponse | string,
    authorization: string,
    action = INVITATION_OR_JOIN_ACTION.accept,
) {
    try {
        if (typeof invitation !== "string") {
            invitation = invitation.body._id;
        }
        return client
            .post("/invitation-join/complete")
            .send({
                _id: invitation,
                action,
            })
            .set("Authorization", authorization);
    } catch (error) {
        errorOut(completeMockInvitationJoin, error);
    }
}

/**
 * Assigns a user as co-admin*
 * @param {Client} client - http client
 * @param {string} auth - - bearer token used with the `Authorization` header
 * @param {MockUserResponse} user - user who'll be assigned as co-admin
 * @param {School} school - the school where the user will be assigned as co-admin
 * @param {(1 | 2)} [index=1] - decides whether to add as `coAdmin1`|`coAdmin2`
 */
export async function assignMockCoAdmin(
    client: Client,
    auth: string,
    user: MockUserResponse,
    school: School,
    index: 1 | 2 = 1,
) {
    try {
        return await client
            .put(`/school/${school.short_name}/co-admin`)
            .set("Authorization", auth)
            .send({ index, email: user.body._id } as AddCoAdminDTO);
    } catch (error) {
        errorOut(assignMockCoAdmin, error);
    }
}

/**
 * Creates a mock co-admin & returns it
 * @param {Client} client - http client
 * @param {string} auth - bearer token used with the `Authorization` header
 * @param {MockUserResponse} [user] - optional user who'll be added as co-admin
 */
export async function createMockCoAdmin(
    client: Client,
    auth: string,
    user?: MockUserResponse,
) {
    try {
        if (!user) user = await createMockUser(client);
        const invitation = await createMockInvitation(client, auth, user);
        await completeMockInvitationJoin(
            client,
            invitation,
            createJwtTokenFromHeader(user),
        );
        return await assignMockCoAdmin(client, auth, user, invitation.body.school);
    } catch (error) {
        errorOut(createMockCoAdmin, error);
    }
}

export function createJwtToken(token: string) {
    return `Bearer ${token}`;
}

export function createJwtTokenFromHeader(
    res: Record<string, unknown> & { headers: Record<string, string> },
    field = "x-access-token",
) {
    return createJwtToken(res.headers[field]);
}
