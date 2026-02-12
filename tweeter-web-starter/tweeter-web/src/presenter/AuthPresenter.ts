import { AuthToken, User } from "tweeter-shared";
import { AuthService } from "../model.service/AuthService";

export interface AuthView {
  setIsLoading: (isLoading: boolean) => void;
  displayErrorMessage: (message: string) => void;
  navigate: (url: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
}

export abstract class AuthPresenter {
  private _view: AuthView;
  private _authService: AuthService;

  protected constructor(view: AuthView) {
    this._view = view;
    this._authService = new AuthService();
  }

  protected get view(): AuthView {
    return this._view;
  }

  protected get authService(): AuthService {
    return this._authService;
  }
}
