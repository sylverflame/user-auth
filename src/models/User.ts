import { Role } from "./types";

interface IUser {
  getid(): number;
  getFirstName(): string;
}

export class User implements IUser {
  private id: number;
  private firstName: string;
  private role: Role;

  constructor(id: number, firstName: string, role: Role) {
    this.id = id;
    this.firstName = firstName;
    this.role = role;
  }

  getid(): number {
    return this.id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getRole(): Role {
    return this.role;
  }

  toString(): string {
    return "ID: " + this.id + " Name: " + this.firstName;
  }
}
