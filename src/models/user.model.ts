import { UserResponse } from "../schemas/user.schema";
import { Role } from "./types";

export class User {
  private id: string;
  private firstName: string;
  private lastName: string;
  private role: Role;
  private username: string;
  private password: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    role: Role,
    username: string,
    password: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.username = username;
    this.password = password;
  }

  getId(): string {
    return this.id;
  }

  getUserData(): UserResponse {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
    };
  }

  getFirstName(): string {
    return this.firstName;
  }

  getRole(): Role {
    return this.role;
  }

  getPassword(): string {
    return this.password;
  }

  toString(): string {
    return "ID: " + this.id + " Name: " + this.firstName + " " + this.lastName;
  }
}
