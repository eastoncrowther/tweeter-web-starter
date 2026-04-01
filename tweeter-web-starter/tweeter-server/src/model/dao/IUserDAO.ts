export interface UserRecord {
  alias: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  passwordHash: string;
}

export interface IUserDAO {
  putUser(user: UserRecord): Promise<void>;
  getUser(alias: string): Promise<UserRecord | undefined>;
}
