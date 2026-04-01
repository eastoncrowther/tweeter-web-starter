import { IDAOFactory } from "../dao/IDAOFactory";

const TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

export class AuthorizationService {
  private daoFactory: IDAOFactory;

  constructor(daoFactory: IDAOFactory) {
    this.daoFactory = daoFactory;
  }

  /**
   * Validates the given auth token. If valid, refreshes the token timestamp
   * (sliding window) and returns the alias of the authenticated user.
   * Throws an error with "[Unauthorized]" prefix if invalid or expired.
   */
  public async validateToken(token: string): Promise<string> {
    if (!token) {
      throw new Error("[Unauthorized] Missing auth token");
    }

    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    const record = await authTokenDAO.getAuthToken(token);

    if (!record) {
      throw new Error("[Unauthorized] Invalid auth token");
    }

    const now = Date.now();
    if (now - record.timestamp > TOKEN_EXPIRATION_MS) {
      // Token has expired — delete it and reject
      await authTokenDAO.deleteAuthToken(token);
      throw new Error("[Unauthorized] Auth token has expired");
    }

    // Refresh the token timestamp (sliding window)
    await authTokenDAO.updateAuthTokenTimestamp(token, now);

    return record.alias;
  }
}
