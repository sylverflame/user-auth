import { NextFunction, Request, Response } from "express";
import { ErrorCodes, Status } from "../models/types";
import { logger } from "../winston";

const loginLogger = logger.child({ label: "LoginController" });

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwt = (req as any).token;
    res.status(Status.Success).json({ message: "Login Successful", jwt });
    return;
  } catch (error: any) {
    loginLogger.error(`loginUser failed - ${error.message}`, {
      stack: error.stack,
    });
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};
