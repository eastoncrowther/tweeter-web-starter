export interface AuthTokenRecord {
  token: string;
  alias: string;
  timestamp: number;
}

export interface IAuthTokenDAO {
  putAuthToken(record: AuthTokenRecord): Promise<void>;
  getAuthToken(token: string): Promise<AuthTokenRecord | undefined>;
  updateAuthTokenTimestamp(token: string, timestamp: number): Promise<void>;
  deleteAuthToken(token: string): Promise<void>;
}
