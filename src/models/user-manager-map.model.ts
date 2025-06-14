import { ROLES } from "../configs/constants";
import { UserResponse } from "../schemas/user.schema";
import { User } from "./user.model";

export class UserManagerMap {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  addUser(user: User): void {
    const id = user.getId();
    this.users.set(id, user);
  }

  getUser(id: string): UserResponse | null {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }
    return user.getUserData();
  }

  getUserPassword(id: string): string | undefined {
    return this.users.get(id)?.getPassword();
  }

  getAllUsers(): UserResponse[] {
    return [...this.users.values()].map((user) => user.getUserData());
  }
  getAdmins(): UserResponse[] {
    return [...this.users.values()]
      .filter((user) => user.getRole() === ROLES.Admin)
      .map((user) => user.getUserData());
  }

  getEmployees(): UserResponse[] {
    return [...this.users.values()]
      .filter((user) => user.getRole() === ROLES.Employee)
      .map((user) => user.getUserData());
  }

  removeUser(id: string): boolean {
    return this.users.delete(id);
  }

  deleteAllUsers(): void {
    this.users.clear();
  }

  getSize(): number {
    return this.users.size;
  }
}
