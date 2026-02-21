import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostView extends View {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class PostPresenter extends Presenter<PostView> {
  private _service: StatusService;

  public constructor(view: PostView) {
    super(view);
    this._service = new StatusService();
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
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser, Date.now());

        await this.service.postStatus(authToken, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      }, "post the status");
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
