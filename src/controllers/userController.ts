import { ROLES } from "../configs/constants";
import { User } from "../models/User";
import { UserManagerMap } from "../models/UserManagerMap";
import { ErrorCodes, Role, Status, SuccessCodes } from "../models/types";

const userManagerMap = new UserManagerMap();

// -- Create
export const createUser = (req: any, res: any) => {
  try {
    // Check for no payload
    if (!req.body) {
      return res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_001 });
    }

    const { name, role } = req.body;
    // Check for presence of the individual properties
    if (!name || !role) {
      return res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_002 });
    }

    // Check for correct role value
    if (!Object.values(ROLES).includes(role)) {
      return res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_003 });
    }

    // Create user
    const totalUsers = userManagerMap.getSize();
    const id = totalUsers + 1;
    const user = new User(id, name, role as Role);
    userManagerMap.addUser(user);
    res
      .status(Status.Created)
      .json({ message: SuccessCodes.SUCCESS_001, user });
  } catch (e: any) {
    res.status(Status.InternalServerError).json({ error: e.message });
  }
};

// -- Read
export const getUser = (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = userManagerMap.getUser(parseInt(id));
    if (!user) {
      // IMPORTANT - Add a return statement like below if there is response after this block as well
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
export const deleteUser = (req: any, res: any) => {
  const { id } = req.params;
  try {
    const isRemoved = userManagerMap.removeUser(parseInt(id));

    if (!isRemoved) {
      return res.status(Status.NotFound).json({ error: ErrorCodes.ERR_004 });
    }
    res.status(Status.Success).json({ message: SuccessCodes.SUCCESS_004 });
  } catch (e: any) {
    res.status(Status.InternalServerError).json({ error: e.message });
  }
};
