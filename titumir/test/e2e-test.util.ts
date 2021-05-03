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

export function bootstrapApp(app: INestApplication) {
  app.useGlobalFilters(new QueryFailedFilter(), new EntityNotFoundFilter());
  app.useGlobalPipes(new ValidationPipe());
  const reflector = new Reflector();
  const jwtAuthGuard = app.select(AppModule).get(JWT_AUTH_GUARD);
  const roleAuthGuard = new RoleAuthGuard(reflector);
  app.useGlobalGuards(jwtAuthGuard, roleAuthGuard);
}

export const uStr = (from = 7) => Date.now().toString().substr(from);

// create mocks
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

export async function createMockUser(
  client: request.SuperTest<request.Test>,
  payload?: SignupDTO
) {
  if (!payload) payload = generateMockUser();

  const user: MockUserResponse = await client
    .post("/auth/signup")
    .send(payload);
  return user;
}

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
  >;
};
export async function createMockSchool(
  client: request.SuperTest<request.Test>,
  authorization: string,
  payload?: CreateSchoolDTO
) {
  if (!payload) payload = generateMockSchool();

  const school: MockSchoolResponse = await client
    .post("/school")
    .set("Authorization", authorization)
    .send(payload);
  return school;
}

export function createJwtToken(token: string) {
  return `Bearer ${token}`;
}

export function createJwtTokenFromHeader(
  res: Record<string, unknown> & { headers: Record<string, string> },
  field = "x-access-token"
) {
  return createJwtToken(res.headers[field]);
}
