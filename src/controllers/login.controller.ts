import { NextFunction, Request, Response } from "express";
import { ErrorCodes, Status } from "../models/types";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { userManagerMap, usernameIDMap } from "./user.controller";
import { logger } from "../winston";
import { authenticateUserSchema } from "../schemas/user.schema";
import { ZodError } from "zod/v4";

const loginLogger = logger.child({ label: "LoginController" });

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_009 });
    }

    const parsedBody = authenticateUserSchema.parse(req.body);
    const { username, password } = parsedBody;

    const userId = usernameIDMap.getUserId(username);
    const savedPassword = userId
      ? userManagerMap.getUserPassword(userId)
      : null;

    if (!savedPassword || savedPassword !== password) {
      res.status(Status.Unauthorized).json({ error: ErrorCodes.ERR_009 });
      return;
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      res.status(Status.InternalServerError).end();
      return;
    }

    const token = jwt.sign({ name: username, role: "Admin" }, secretKey, {
      expiresIn: "30m",
    });
    // Typecast it to any to append token to request
    (req as any).token = token;

    next();
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_009 });
      return;
    }
    loginLogger.error(`authenticateUser failed - ${error.message}`, {
      stack: error.stack,
    });
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { headers } = req;
    const token = headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(Status.Forbidden).end();
      return;
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      res.status(Status.InternalServerError).end();
      return;
    }

    const userData = jwt.verify(token, secretKey); //User data extracted from token - This also throws an error if there is as issue in the token
    next();
  } catch (error: any) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      res.status(Status.Forbidden).json({ error: error.message });
      return;
    }
    loginLogger.error(`validateToken failed - ${error.message}`, {
      stack: error.stack,
    }); // Can include stack in the log if required
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};

export const loginUser = (req: Request, res: Response, next: any) => {
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
