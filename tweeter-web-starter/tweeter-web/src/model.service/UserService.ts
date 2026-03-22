import { Buffer } from "buffer";
import { AuthToken, FakeData, User, LoginRequest, RegisterRequest, LogoutRequest, GetUserRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "./net/ServerFacade";

export class UserService implements Service {
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      alias: alias,
    };
    return new ServerFacade().getUser(request);
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      token: "",
      alias: alias,
      password: password,
    };
    return new ServerFacade().login(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request: RegisterRequest = {
      token: "",
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };
    return new ServerFacade().register(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
    };
    await new ServerFacade().logout(request);
  }
}
