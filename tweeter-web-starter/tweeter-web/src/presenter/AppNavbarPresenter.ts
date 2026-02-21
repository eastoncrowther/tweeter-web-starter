import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface AppNavbarView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
  navigateToLogin: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private userService: UserService;

  constructor(view: AppNavbarView) {
    super(view);
    this.userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "log user out");
  }
}
