import { UserDto, AuthTokenDto, AuthToken } from "tweeter-shared";
import { IDAOFactory } from "../dao/IDAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export class UserService {
  private daoFactory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(daoFactory: IDAOFactory) {
    this.daoFactory = daoFactory;
    this.authService = new AuthorizationService(daoFactory);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDAO = this.daoFactory.getUserDAO();
    const userRecord = await userDAO.getUser(alias);

    if (!userRecord) {
      throw new Error("[Bad Request] Invalid alias or password");
    }

    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) {
      throw new Error("[Bad Request] Invalid alias or password");
    }

    // Generate auth token and persist it
    const authToken = AuthToken.Generate();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    await authTokenDAO.putAuthToken({
      token: authToken.token,
      alias: alias,
      timestamp: authToken.timestamp,
    });

    const userDto: UserDto = {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      alias: userRecord.alias,
      imageUrl: userRecord.imageUrl,
    };

    return [userDto, authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDAO = this.daoFactory.getUserDAO();

    // Check if user already exists
    const existingUser = await userDAO.getUser(alias);
    if (existingUser) {
      throw new Error("[Bad Request] User with this alias already exists");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Upload image to S3
    const s3DAO = this.daoFactory.getS3DAO();
    const fileName = `${alias}.${imageFileExtension}`;
    const imageUrl = await s3DAO.putImage(fileName, userImageBytes);

    // Save user to database
    await userDAO.putUser({
      alias,
      firstName,
      lastName,
      imageUrl,
      passwordHash,
    });

    // Generate auth token and persist it
    const authToken = AuthToken.Generate();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    await authTokenDAO.putAuthToken({
      token: authToken.token,
      alias: alias,
      timestamp: authToken.timestamp,
    });

    const userDto: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl,
    };

    return [userDto, authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    await authTokenDAO.deleteAuthToken(token);
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    await this.authService.validateToken(token);

    const userDAO = this.daoFactory.getUserDAO();
    const userRecord = await userDAO.getUser(alias);

    if (!userRecord) {
      return null;
    }

    return {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      alias: userRecord.alias,
      imageUrl: userRecord.imageUrl,
    };
  }
}
