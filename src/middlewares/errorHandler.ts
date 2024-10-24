import { NextFunction, Request, Response } from "express";
import { ValidationException } from "../exceptions/validationException";
import { NotFoundException } from "../exceptions/notFoundException";
import { ConflictException } from "../exceptions/conflictException";
import Logger from "../lib/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationException) {
    res.status(err.status).json(JSON.parse(err.message));
    return;
  }

  if (err instanceof NotFoundException || err instanceof ConflictException) {
    res.status(err.status).json({ detail: err.message, status: err.status });
    return;
  }

  Logger.error(err);

  res.status(500).json({
    detail: "Something went wrong. We are working to fix the issue",
    status: 500,
  });
};
