import { NextFunction, Request, Response } from "express";
import { ErrorCodes, Status } from "../models/types";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { userManagerMap, usernameIDMap } from "./user.controller";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

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
      expiresIn: "1m",
    });
    // Typecast it to any to append token to request
    (req as any).token = token;

    next();
  } catch (error: any) {
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

    const userData = jwt.verify(token, secretKey); //User data extracted from token
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(Status.Forbidden).json({ error: error.message });
      return;
    }
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};

export const loginUser = (req: Request, res: Response, next: any) => {
  const jwt = (req as any).token;
  res.json({ message: "Login Successful", jwt });
};
