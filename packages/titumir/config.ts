import { CookieOptions } from "express";

export const NODE_ENV = process.env.NODE_ENV;
// all the env vars
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT)
    : undefined;
export const DATABASE_NAME = process.env.POSTGRES_DB;
export const DATABASE_PASSWORD = process.env.POSTGRES_PASSWORD;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
export const NOT_A_SECRET = process.env.NOT_A_SECRET;
export const COOKIE_SIGNATURE = process.env.COOKIE_SIGNATURE;
export const OPENVIDU_SERVER_URL = process.env.OPENVIDU_SERVER_URL as string;
export const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET as string;
export const PORT = process.env.PORT ?? 4000;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN;

// constants
export const CONST_JWT_ACCESS_EXPIRATION_DURATION = "3600s";
export const CONST_ACCESS_TOKEN_EXPIRATION = 3600000;
export const CONST_JWT_REFRESH_EXPIRATION_DURATION = "15d";
export const CONST_REFRESH_TOKEN_HEADER = "x-refresh-token";
export const CONST_JWT_ACCESS_TOKEN_COOKIE = "Authorization";

export const AUTHORIZATION_COOKIE_OPTS: CookieOptions = Object.freeze({
    maxAge: CONST_ACCESS_TOKEN_EXPIRATION,
    signed: true,
    httpOnly: true,
});
