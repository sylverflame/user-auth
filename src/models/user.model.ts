import { Role } from "./types";

export class User {
  private id: number;
  private firstName: string;
  private lastName: string;
  private role: Role;

  constructor(id: number, firstName: string, lastName: string, role: Role) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }

  getId(): number {
    return this.id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getRole(): Role {
    return this.role;
  }

  toString(): string {
    return "ID: " + this.id + " Name: " + this.firstName + " " + this.lastName;
  }
}
