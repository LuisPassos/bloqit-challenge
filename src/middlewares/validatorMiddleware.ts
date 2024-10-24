import { validate } from "class-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { ValidationException } from "../exceptions/validationException";

export function validateBody<T>(targetClass: any): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors = await validate(plainToInstance(targetClass, req.body));
    if (errors.length > 0) {
      throw new ValidationException(
        JSON.stringify(
          errors.map((error) => {
            return {
              property: error.property,
              constraints: error.constraints,
            };
          })
        )
      );
    }
    next();
  };
}
