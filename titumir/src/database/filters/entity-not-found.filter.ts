import { HttpStatus } from "@nestjs/common";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";
import { EntityNotFoundError } from "typeorm";

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  formateObject(payload: Record<string, any>) {
    const entries = Object.entries(payload);
    return entries
      .map(
        ([key, value], i) =>
          `${key}=\`${value}\`${i === entries.length - 1 ? "" : ", "}`
      )
      .join("");
  }

  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const entityName = exception.message
      .match(/".*"/g)[0]
      .replace(/"/g, "")
      .toLowerCase();
    const params = this.formateObject(req.params);
    const queries = this.formateObject(req.query);
    const body = this.formateObject(req.body);
    return res.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      error: "Not Found",
      message: `no ${entityName} found with${
        params ? ` params: ${params}` : ""
      }${queries ? ` queries: ${queries}` : ""}${body ? ` body: ${body}` : ""}`,
    });
  }
}
