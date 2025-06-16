import { Request } from "express";
import { Role } from "../models/types";

export interface RequestWithUser extends Request {
  user: {
    name: string;
    role: Role;
  };
}
