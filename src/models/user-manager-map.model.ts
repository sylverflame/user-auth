import { ROLES } from "../configs/constants";
import { UserResponse } from "../schemas/user.schema";
import { User } from "./user.model";

export class UserManagerMap {
  private users: Map<string, User>;
  private usernameIdMap: Map<string, string>;
  //  TODO: Introduce hasSuperAdmin and levels

  constructor() {
    this.users = new Map();
    this.usernameIdMap = new Map();
  }

  addUser(user: User): void {
    const id = user.getId();
    const username = user.getUsername();
    this.users.set(id, user);
    this.usernameIdMap.set(username, id);
  }

  getUserById(id: string): User | null {
    const user = this.users.get(id);
    if (!user) return null;
    return user;
  }

  getUserByUsername(username: string): User | null {
    const userId = this.usernameIdMap.get(username);
    if (!userId) return null;
    return this.getUserById(userId);
  }

  getAllUsernames(): string[] {
    return [...this.usernameIdMap.keys()];
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
    const username = this.users.get(id)?.getUsername();
    if (!username) return false;

    this.users.delete(id);
    this.usernameIdMap.delete(username);
    return true;
  }

  removeAllUsers(): void {
    this.users.clear();
    this.usernameIdMap.clear();
  }

  getSize(): number {
    return this.users.size;
  }
}
