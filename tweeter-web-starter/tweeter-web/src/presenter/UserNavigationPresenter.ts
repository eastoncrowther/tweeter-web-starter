import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigateTo: (url: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private _userService: UserService = new UserService();

  protected get userService(): UserService {
    return this._userService;
  }

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User | null,
    eventTargetString: string,
    pathPrefix: string,
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(eventTargetString);
      const user = await this.userService.getUser(authToken, alias);

      if (user) {
        if (!displayedUser || !user.equals(displayedUser)) {
          this.view.setDisplayedUser(user);
          this.view.navigateTo(`${pathPrefix}/${user.alias}`);
        }
      }
    }, "get user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
