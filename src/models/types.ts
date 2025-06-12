export type Role = "Admin" | "Employee";
export enum Status {
  Success = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum ErrorCodes {
  ERR_001 = "No user payload received",
  ERR_002 = "Missing required fields: id, name, or role",
  ERR_003 = "Invalid role",
  ERR_004 = "No user found",
  ERR_005 = "Sorry can't find that!",
  ERR_006 = "Something broke!",
}

export enum SuccessCodes {
  SUCCESS_001 = "User created successfully",
  SUCCESS_002 = "User retrieved",
  SUCCESS_003 = "User created successfully",
  SUCCESS_004 = "User deleted successfully",
}
