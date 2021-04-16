import * as dotenv from "dotenv";

dotenv.config();
// all the env vars
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = parseInt(process.env.DATABASE_PORT);
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const NOT_A_SECRET = process.env.NOT_A_SECRET;
export const NODE_ENV = process.env.NODE_ENV;

// constants
export const CONST_JWT_ACCESS_EXPIRATION_DURATION = "3600s";
export const CONST_JWT_REFRESH_EXPIRATION_DURATION = "15d";
export const CONST_ACCESS_TOKEN_HEADER = "x-access-token";
export const CONST_REFRESH_TOKEN_HEADER = "x-refresh-token";
