import { UserResponse } from "../schemas/user.schema";
import { HeirarchyLevels, Role } from "./types";

export class User {
  private id: string;
  private firstName: string;
  private lastName: string;
  private role: Role;
  private username: string;
  private password: string;
  private heirarchy: number;
  private createdAt: Date;

  constructor(
    firstName: string,
    lastName: string,
    role: Role,
    username: string,
    password: string
  ) {
    this.id =
      firstName.toLowerCase() +
      "-" +
      lastName.toLowerCase() +
      "-" +
      crypto.randomUUID();
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.username = username;
    this.password = password;
    this.heirarchy = HeirarchyLevels.User;
    this.createdAt = new Date();
  }

  // Used when a new user is registerng themselves. TypeScript does not multiple constructors like Java, hence this approach
  public static registerUser(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ): User {
    return new User(firstName, lastName, "User", username, password);
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

  setRole(role: Role): void {
    this.role = role;
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getHeirarchy(): number {
    return this.heirarchy;
  }

  toString(): string {
    return "ID: " + this.id + " Name: " + this.firstName + " " + this.lastName;
  }
}
