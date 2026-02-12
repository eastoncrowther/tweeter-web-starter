import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostPresenter {
  private _view: PostView;
  private _service: StatusService;

  public constructor(view: PostView) {
    this._view = view;
    this._service = new StatusService();
  }

  protected get view(): PostView {
    return this._view;
  }

  protected get service(): StatusService {
    return this._service;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser, Date.now());

      await this.service.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
