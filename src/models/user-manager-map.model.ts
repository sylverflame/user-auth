import { ROLES } from "../configs/constants";
import { User } from "./user.model";

export class UserManagerMap {
  private users: Map<number, User>;

  constructor() {
    this.users = new Map();
  }

  addUser(user: User): void {
    const id = user.getId();
    this.users.set(id, user);
  }

  getUser(id: number): User | null {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }
    return user;
  }

  getAllUsers(): User[] {
    return [...this.users.values()];
  }
  getAdmins(): User[] {
    return [...this.users.values()].filter(
      (user) => user.getRole() === ROLES.Admin
    );
  }

  getEmployees(): User[] {
    return [...this.users.values()].filter(
      (user) => user.getRole() === ROLES.Employee
    );
  }

  removeUser(id: number): boolean {
    return this.users.delete(id);
  }

  deleteAllUsers(): void {
    this.users.clear();
  }

  getSize(): number {
    return this.users.size;
  }
}
