import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { DeleteResult, getRepository } from "typeorm";
import SignupDTO from "../src/auth/dto/signup.dto";
import JwtAuthGuard from "../src/auth/guards/jwt-auth.guard";
import RoleAuthGuard from "../src/auth/guards/role-auth.guard";
import User from "../src/database/entity/users.entity";
import request, { Response } from "supertest";
import CreateSchoolDTO from "../src/school/dto/create-school.dto";
import School from "../src/database/entity/schools.entity";
import { EntityNotFoundFilter } from "../src/database/filters/entity-not-found.filter";
import { QueryFailedFilter } from "../src/database/filters/query-failed.filter";

export function bootstrapApp(app: INestApplication) {
  app.useGlobalFilters(new QueryFailedFilter(), new EntityNotFoundFilter());
  app.useGlobalPipes(new ValidationPipe());
  const reflector = new Reflector();
  const jwtAuthGuard = new JwtAuthGuard(reflector);
  const roleAuthGuard = new RoleAuthGuard(reflector);
  app.useGlobalGuards(jwtAuthGuard, roleAuthGuard);
}

export interface SignUpUserReturns extends Response {
  clearUser: (school?: boolean) => Promise<DeleteResult>;
}

/**
 * Creates a mock user from provided payload & returns an
 * appropriate response with all required authorization resource
 * Also returns a `clearUser` method, which can be used to clear the
 * created user afterwards
 * @param {Server} client - server to call for signup
 * @param {SignupDTO} payload - the mock user data
 */
export async function signUpUser(
  client: request.SuperTest<request.Test>,
  payload: SignupDTO
): Promise<SignUpUserReturns> {
  // removes the created user from database
  async function clearUser(school?: boolean): Promise<DeleteResult> {
    try {
      const userRepo = getRepository(User);
      if (school) {
        await userRepo.update(
          { email: payload.email },
          { school: null, role: null }
        );
      }
      return await userRepo.delete({ email: payload.email });
    } catch (error) {
      console.error("[Failed to delete mock user]: ", error.message);
    }
  }
  const user = await client.post("/auth/signup").send(payload);
  Object.assign(user, { clearUser });
  return user as SignUpUserReturns;
}

export type CreateSchoolReturns = Response & {
  clearSchool: () => Promise<DeleteResult>;
  user: Omit<SignUpUserReturns, "clearUser">;
};

/**
 * Creates a mock school & a admin before it & gives a `clearSchool`
 * method to delete the mock school afterAll/Each
 * @param {request.SuperTest<request.Test>} client - http client
 * @param {CreateSchoolDTO} payload - the school metadata which will be
 * used as the property for the mock school
 */
export async function createSchool(
  client: request.SuperTest<request.Test>,
  payload: CreateSchoolDTO
): Promise<CreateSchoolReturns> {
  //signing up admin user
  const user = await signUpUser(client, {
    email: `no-name${Date.now().toString().substring(7)}@company.org`,
    first_name: "Walla",
    last_name: "hah",
    password: "weakest password in the entire world",
  });
  // creating te school with proper author
  const school = await client
    .post("/school")
    .set("Authorization", `Bearer ${user.headers["x-access-token"]}`)
    .send(payload);

  // deletes the created school along with its admin
  async function clearSchool() {
    try {
      const schoolRepo = getRepository(School);
      const userRepo = getRepository(User);
      // updating the user because of Foreign Key Constrain
      // doesn't allow to delete the user if its assigned as admin
      // to school
      await userRepo.update(
        { email: user.body.email },
        { school: null, role: null }
      );
      const deletedSchool = await schoolRepo.delete({ _id: school.body._id });
      // clearing the user after deleting the school
      await user.clearUser();
      return deletedSchool;
    } catch (error) {
      console.error("[Failed to delete mock school]: ", error.message);
    }
  }
  Object.assign(school, {
    clearSchool,
    user: { ...user, clearUser: undefined },
  });
  return school as CreateSchoolReturns;
}
