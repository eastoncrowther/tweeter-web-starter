import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
}

export class PostPresenter extends Presenter<PostView> {
  private _service: StatusService = new StatusService();

  protected get service(): StatusService {
    return this._service;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    let messageId: string | undefined;

    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        messageId = this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser, Date.now());

        await this.service.postStatus(authToken, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      }, "post the status");
    } finally {
      if (messageId) {
        this.view.deleteMessage(messageId);
      }
      this.view.setIsLoading(false);
    }
  }
}
