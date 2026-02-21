import { AuthToken, User } from "tweeter-shared";
import { AuthService } from "../model.service/AuthService";
import { Presenter, View } from "./Presenter";

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
  private _authService: AuthService;

  protected constructor(view: AuthView) {
    super(view);
    this._authService = new AuthService();
  }

  protected get authService(): AuthService {
    return this._authService;
  }
}
