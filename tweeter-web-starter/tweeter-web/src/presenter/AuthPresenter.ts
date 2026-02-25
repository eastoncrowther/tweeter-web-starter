import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface AuthView extends View {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (url: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
}

export abstract class AuthPresenter extends Presenter<AuthView> {
  private _service: UserService = new UserService();

  protected get service(): UserService {
    return this._service;
  }
  protected async doAuthOperation(
    operation: () => Promise<[User, AuthToken]>,
    operationDescription: string,
    rememberMe: boolean,
    navigateUrl?: string,
  ) {
    try {
      this.view.setIsLoading(true);

      await this.doFailureReportingOperation(async () => {
        const [user, authToken] = await operation();

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (navigateUrl) {
          this.view.navigate(navigateUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      }, operationDescription);
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
