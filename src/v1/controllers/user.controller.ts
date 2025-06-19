import { Request, Response } from "express";
import { ZodError } from "zod/v4";
import { ErrorCodes, Role, Status, SuccessCodes } from "../models/types";
import { UserManagerMap } from "../models/user-manager-map.model";
import { User } from "../models/user.model";
import {
  CreateUserSchema,
  GetUsersQueryParamsSchema,
  RegisterUserSchema,
} from "../schemas/user.schema";
import { logger } from "../../winston";

export const userManagerMap = new UserManagerMap();
const userLogger = logger.child({ label: "UserController" });

// -- Create
export const registerUser = (req: Request, res: Response) => {
  try {
    // Check for no payload
    if (!req.body) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_001 });
      return;
    }

    const parsedBody = RegisterUserSchema.parse(req.body);
    const { username, password, firstName, lastName } = parsedBody;

    // Check for duplicate username
    if (userManagerMap.getAllUsernames().includes(username)) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_007 });
      return;
    }

    const user = User.registerUser(firstName, lastName, username, password);
    userManagerMap.addUser(user);

    res.status(Status.Created).json({
      message: SuccessCodes.SUCCESS_001,
      id: user.getId(),
      firstName,
      lastName,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map(
        (issue) => issue.path + " " + issue.message
      );
      res.status(Status.BadRequest).json({ error: issues });
      return;
    }
  }
};
export const createUser = (req: Request, res: Response) => {
  try {
    // Check for no payload
    if (!req.body) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_001 });
      return;

      // Parse the data
    }

    // Parse user data
    const userBody = CreateUserSchema.parse(req.body); // Zod throws an error, if any
    const { firstName, lastName, role, username, password } = userBody;

    // Check for duplicate username
    if (userManagerMap.getAllUsernames().includes(username)) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_007 });
      return;
    }

    // Create user
    const user = new User(firstName, lastName, role, username, password);
    userManagerMap.addUser(user);

    res.status(Status.Created).json({
      message: SuccessCodes.SUCCESS_001,
      id: user.getId(),
      firstName,
      lastName,
    });
  } catch (e: any) {
    if (e instanceof ZodError) {
      const issues = e.issues.map((issue) => issue.path + " " + issue.message);
      res.status(Status.BadRequest).json({ error: issues });
      return;
    }
    userLogger.error(`createUser failed - ${e.message}`, {
      stack: e.stack,
    });
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};

// -- Read
export const getUser = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = userManagerMap.getUserById(id);
    if (!user) {
      // IMPORTANT - Add a return statement like below if there is response after this block as well
      res.status(Status.NotFound).json({ error: ErrorCodes.ERR_004 });
      return;
    }
    res
      .status(Status.Success)
      .json({ message: SuccessCodes.SUCCESS_002, user: user.getUserData() });
  } catch (e: any) {
    userLogger.error(`getUser failed - ${e.message}`, {
      stack: e.stack,
    });
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};

export const getAllUsers = (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    GetUsersQueryParamsSchema.parse(role);
    let users;
    if (!role) {
      users = userManagerMap.getAllUsers();
    } else {
      users = userManagerMap.getUsersByRole(role as Role);
    }
    res.status(Status.Success).json({ users });
  } catch (e: any) {
    userLogger.error(`getAllUsers failed - ${e.message}`, {
      stack: e.stack,
    });
    if (e instanceof ZodError) {
      res.status(Status.BadRequest).end();
      return;
    }
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};

// -- Update

// -- Delete
export const deleteUser = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = userManagerMap.getUserById(id)?.getRole();

    if ((req as any).user.role === userRole) {
      res.status(Status.Forbidden).json({ error: ErrorCodes.ERR_011 });
      return;
    }

    // Remove user
    const isRemoved = userManagerMap.removeUser(id);

    if (!isRemoved) {
      res.status(Status.NotFound).json({ error: ErrorCodes.ERR_004 });
      return;
    }
    res.status(Status.Success).json({ message: SuccessCodes.SUCCESS_004 });
  } catch (e: any) {
    userLogger.error(`deleteUser failed - ${e.message}`, {
      stack: e.stack,
    });
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};
