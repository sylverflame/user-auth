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

  getUserId(username: string): string | undefined {
    return this.usernameIDMap.get(username);
  }

  removeUser(username: string): void {
    this.usernameIDMap.delete(username);
  }

  getAllUsernames(): string[] {
    return [...this.usernameIDMap.keys()];
  }
}
