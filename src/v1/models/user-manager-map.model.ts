import { ROLES } from "../configs/constants";
import { UserResponse } from "../schemas/user.schema";
import { Role } from "./types";
import { User } from "./user.model";

export class UserManagerMap {
  private users: Map<string, User>;
  private usernameIdMap: Map<string, string>;
  private hasSuperAdmin: boolean;
  //  TODO: Introduce hasSuperAdmin and levels

  constructor() {
    this.users = new Map();
    this.usernameIdMap = new Map();
    this.hasSuperAdmin = false;
  }

  addUser(user: User): void {
    const id = user.getId();
    const username = user.getUsername();
    // First user registered will get the SuperAdmin Role
    if (this.users.size === 0) user.setRole(ROLES.SuperAdmin);
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

  getUsersByRole(role: Role): UserResponse[] {
    return [...this.users.values()]
      .filter((user) => user.getRole() === role)
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

  getHasSuperAdmin(): boolean {
    return this.hasSuperAdmin;
  }

  setHasSuperAdmin(status: boolean): void {
    this.hasSuperAdmin = status;
  }
}
