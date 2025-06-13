export class UsernameIDMap {
  private usernameIDMap: Map<string, string>;

  /**
   *
   */
  constructor() {
    this.usernameIDMap = new Map();
  }

  addUser(uuid: string, username: string): void {
    this.usernameIDMap.set(username, uuid);
  }

  removeUser(username: string): void {
    this.usernameIDMap.delete(username);
  }

  getAllUsernames(): string[] {
    return [...this.usernameIDMap.keys()];
  }
}
