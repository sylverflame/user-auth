import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod/v4";
import { userManagerMap } from "../controllers/user.controller";
import { ErrorCodes, Role, Status } from "../models/types";
import { AuthenticateUserSchema, TokenUserData } from "../schemas/user.schema";
import { logger } from "../../winston";
import { User } from "../models/user.model";

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

    const parsedBody = AuthenticateUserSchema.parse(req.body);
    const { username, password } = parsedBody;

    const userId = userManagerMap.getUserByUsername(username)?.getId();
    const savedPassword = userId
      ? userManagerMap.getUserById(userId)?.getPassword()
      : null;

    if (!userId || !savedPassword || savedPassword !== password) {
      res.status(Status.Unauthorized).json({ error: ErrorCodes.ERR_009 });
      return;
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      res.status(Status.InternalServerError).end();
      return;
    }

    const role = userManagerMap.getUserById(userId)?.getRole();
    const isAdmin = role === "SuperAdmin" || role === "Admin";

    const token = jwt.sign({ username, role }, secretKey, {
      expiresIn: "1h",
    });
    // Typecast it to any to append token to request
    (req as any).user = { username, role, isAdmin, token };

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
      throw new Error(ErrorCodes.ERR_010);
    }

    const userData = jwt.verify(token, secretKey); //User data extracted from token - This also throws an error if there is as issue in the token

    // Added to restrict response when there is a valid token available for a user, but the user does not exist in the db
    const user: User | null = userManagerMap.getUserByUsername(
      (userData as TokenUserData).username
    );

    if (!user) {
      res.status(Status.Forbidden).end();
      return;
    }

    (req as any).user = userData; // Pass userdata to next middleware, For example to check role for authorization to data
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

export const authorizeRoles = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      res.status(Status.Unauthorized).end();
      return;
    }
    next();
  };
};
