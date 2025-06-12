import { ROLES } from "../configs/constants";
import { User } from "../models/user.model";
import { UserManagerMap } from "../models/user-manager-map.model";
import { ErrorCodes, Role, Status, SuccessCodes } from "../models/types";
import { UserSchema } from "../schemas/user.schema";
import { ZodError } from "zod/v4";
import { Request, Response } from "express";

const userManagerMap = new UserManagerMap();

// -- Create
export const createUser = (req: Request, res: Response) => {
  try {
    // Check for no payload
    if (!req.body) {
      res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_001 });
      return;
    }

    // Parse user data
    const userBody = UserSchema.parse(req.body);
    const { firstName, lastName, role, username, password } = userBody;

    // Generate ID
    const id = userManagerMap.getSize() + 1;

    // Create user
    const user = new User(id, firstName, lastName, role, username, password);
    userManagerMap.addUser(user);

    res
      .status(Status.Created)
      .json({ message: SuccessCodes.SUCCESS_001, id, firstName, lastName });
  } catch (e: any) {
    if (e instanceof ZodError) {
      const issues = e.issues.map((issue) => issue.path + " " + issue.message);
      res.status(Status.BadRequest).json({ error: issues });
      return;
    }
    res.status(Status.InternalServerError).json({ error: e.message });
  }
};

// -- Read
export const getUser = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = userManagerMap.getUser(Number(id));
    if (!user) {
      // IMPORTANT - Add a return statement like below if there is response after this block as well
      res.status(Status.NotFound).json({ error: ErrorCodes.ERR_004 });
      return;
    }
    res
      .status(Status.Success)
      .json({ message: SuccessCodes.SUCCESS_002, user });
  } catch (e: any) {
    res.status(Status.InternalServerError).json({ error: e.message });
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
    res.status(Status.InternalServerError).json({ error: e.message });
  }
};

// -- Update

// -- Delete
export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const isRemoved = userManagerMap.removeUser(Number(id));

    if (!isRemoved) {
      res.status(Status.NotFound).json({ error: ErrorCodes.ERR_004 });
      return;
    }
    res.status(Status.Success).json({ message: SuccessCodes.SUCCESS_004 });
  } catch (e: any) {
    res.status(Status.InternalServerError).json({ error: e.message });
  }
};
