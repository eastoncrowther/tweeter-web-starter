import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {
  public constructor(view: AuthView) {
    super(view);
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.authService.login(alias, password);

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      }, "log user in");
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
