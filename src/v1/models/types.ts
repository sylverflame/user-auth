export type Role = "User" | "Admin" | "Employee" | "SuperAdmin";
export enum Status {
  Success = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum HeirarchyLevels {
  SuperAdmin = 10,
  Admin = 9,
  Employee = 8,
  User = 1,
}

export enum ErrorCodes {
  ERR_001 = "ERR_001: No user payload received",
  ERR_002 = "ERR_002: Missing required fields: id, name, or role",
  ERR_003 = "ERR_003: Invalid role",
  ERR_004 = "ERR_004: No user found",
  ERR_005 = "ERR_005: Sorry can't find that!",
  ERR_006 = "ERR_006: Something went wrong!",
  ERR_007 = "ERR_007: Username already taken!",
  ERR_008 = "ERR_008: Invalid JSON",
  ERR_009 = "ERR_009: Invalid Credentials",
  ERR_010 = "ERR_010: JWT Secret key not set",
  ERR_011 = "ERR_011: Unable to delete users at the same Heirarchy",
}

export enum SuccessCodes {
  SUCCESS_001 = "SUCCESS_001: User created successfully",
  SUCCESS_002 = "SUCCESS_002: User retrieved",
  SUCCESS_003 = "SUCCESS_003: User created successfully",
  SUCCESS_004 = "SUCCESS_004: User deleted successfully",
}
