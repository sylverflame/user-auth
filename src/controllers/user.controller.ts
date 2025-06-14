import { ROLES } from "../configs/constants";
import { User } from "../models/user.model";
import { UserManagerMap } from "../models/user-manager-map.model";
import { ErrorCodes, Role, Status, SuccessCodes } from "../models/types";
import { UserSchema } from "../schemas/user.schema";
import { ZodError } from "zod/v4";
import { Request, Response } from "express";
import { UsernameIDMap } from "../models/user-id-map.model";
import { logger } from "../winston";

export const userManagerMap = new UserManagerMap();
export const usernameIDMap = new UsernameIDMap();
const userLogger = logger.child({ label: "UserController" });

// -- Create
export const createUser = (req: Request, res: Response) => {
  try {
    // Check for no payload
    if (!req.body) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_001 });
      return;
    }

    // Parse user data
    const userBody = UserSchema.parse(req.body); // Zod throws an error, if any
    const { firstName, lastName, role, username, password } = userBody;

    // Check for duplicate username
    if (usernameIDMap.getAllUsernames().includes(username)) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_007 });
      return;
    }

    // Generate ID
    const id = crypto.randomUUID() as string;

    // Create user
    const user = new User(id, firstName, lastName, role, username, password);
    userManagerMap.addUser(user);
    usernameIDMap.addUser(id, username);

    res
      .status(Status.Created)
      .json({ message: SuccessCodes.SUCCESS_001, id, firstName, lastName });
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
    const user = userManagerMap.getUser(id);
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
    let users;
    switch (role) {
      case ROLES.Admin:
        users = userManagerMap.getAdmins();
        res.status(Status.Success).json({ message: "Admin List", users });
        break;
      case ROLES.Employee:
        users = userManagerMap.getEmployees();
        res.status(Status.Success).json({ message: "Employee List", users });
        break;
      default:
        users = userManagerMap.getAllUsers();
        res.status(Status.Success).json({ message: "All Users", users });
        break;
    }
  } catch (e: any) {
    userLogger.error(`getAllUsers failed - ${e.message}`, {
      stack: e.stack,
    });
    res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
  }
};

// -- Update

// -- Delete
export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  try {
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
