import { AuthPresenter } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    await this.doAuthOperation(
      () => {
        return this.service.login(alias, password);
      },
      "log user in",
      rememberMe,
      originalUrl,
    );
  }
}
