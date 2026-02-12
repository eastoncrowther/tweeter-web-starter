import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  navigateTo: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private _userService: UserService;

  public constructor(view: UserNavigationView) {
    this._userService = new UserService();
    this._view = view;
  }

  protected get view(): UserNavigationView {
    return this._view;
  }

  protected get userService(): UserService {
    return this._userService;
  }

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User | null,
    eventTargetString: string,
    pathPrefix: string,
  ): Promise<void> {
    try {
      const alias = this.extractAlias(eventTargetString);
      const user = await this.userService.getUser(authToken, alias);

      if (user) {
        if (!displayedUser || !user.equals(displayedUser)) {
          this.view.setDisplayedUser(user);
          this.view.navigateTo(`${pathPrefix}/${user.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
