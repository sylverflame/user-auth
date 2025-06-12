import { ROLES } from "../configs/constants";
import { User } from "../models/User";
import { UserManager } from "../models/UserManager";
import { ErrorCodes, Role, Status, SuccessCodes } from "../models/types";

const userManager = new UserManager();

export const createUser = (req: any, res: any) => {
  try {
    if (!req.body) {
      return res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_001 });
    }

    const { id, name, role } = req.body;

    if (!id || !name || !role) {
      return res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_002 });
    }

    if (!Object.values(ROLES).includes(role)) {
      return res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_003 });
    }

    const user = new User(id, name, role as Role);
    userManager.addUser(user);
    res
      .status(Status.Created)
      .json({ message: SuccessCodes.SUCCESS_001, user });
  } catch (e: any) {
    res.status(Status.InternalServerError).json({ error: e.message });
  }
};

export const getUser = (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = userManager.getUser(parseInt(id));
    if (!user) {
      return res.status(Status.NotFound).json({ error: ErrorCodes.ERR_004 });
    }
    res
      .status(Status.Success)
      .json({ message: SuccessCodes.SUCCESS_002, user });
  } catch (e: any) {
    res.status(Status.InternalServerError).json({ error: e.message });
  }
};

export const getAllUsers = (req: any, res: any) => {
  try {
    const { role } = req.query;
    let users;
    switch (role) {
      case ROLES.Admin:
        users = userManager.getAdmins();
        res.status(Status.Success).json({ message: "Admin List", users });
        break;
      case ROLES.Employee:
        users = userManager.getEmployees();
        res.status(Status.Success).json({ message: "Employee List", users });
        break;
      default:
        users = userManager.getAllUsers();
        res.status(Status.Success).json({ message: "All Users", users });
        break;
    }
  } catch (e: any) {
    res.status(Status.InternalServerError).json({ error: e.message });
  }
};
