import { ROLES } from "../configs/constants";
import { User } from "./user.model";

// Not used - Retained for example
export class UserManager {
  private users: User[];
  constructor() {
    this.users = [];
  }

  addUser(user: User): void {
    this.users.push(user);
  }
  getUser(id: string): User | null {
    let index: number = this.users.findIndex((user) => user.getId() === id);
    if (index === -1) {
      return null;
    }
    return this.users[index];
  }
  getAllUsers(): User[] {
    return [...this.users]; // return a copy to avoid mutation
  }
  getAdmins(): User[] {
    return this.users.filter((user) => user.getRole() === ROLES.Admin);
  }

  getEmployees(): User[] {
    return this.users.filter((user) => user.getRole() === ROLES.Employee);
  }

  removeUser(id: string): boolean {
    let index: number = this.users.findIndex((user) => user.getId() === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  clearUsers(): void {
    this.users = [];
  }
}
