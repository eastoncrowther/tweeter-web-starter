import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService = new FollowService();

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken,
            currentUser,
            displayedUser,
          ),
        );
      }
    }, "determine follower status");
  }

  private async updateCount(
    operation: () => Promise<void>,
    actionDescription: string,
  ) {
    this.doFailureReportingOperation(async () => {
      await operation();
    }, actionDescription);
  }

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.updateCount(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.updateCount(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser),
      );
    }, "get followeer count");
  }

  private async doActionOnDisplayedUser(
    action: string,
    isFollower: boolean,
    authToken: AuthToken,
    displayedUser: User,
    serviceCall: (token: AuthToken, user: User) => Promise<[number, number]>,
  ): Promise<void> {
    let messageId: string | undefined;

    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        messageId = this.view.displayInfoMessage(
          `${action}ing ${displayedUser.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await serviceCall(
          authToken,
          displayedUser,
        );

        this.view.setIsFollower(isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, `${action} user`);
    } finally {
      if (messageId) {
        this.view.deleteMessage(messageId);
      }
      this.view.setIsLoading(false);
    }
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    let messageId: string | undefined;
    this.doActionOnDisplayedUser(
      "follow",
      true,
      authToken,
      displayedUser,
      (t, u) => this.service.follow(t, u),
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    let messageId: string | undefined;
    this.doActionOnDisplayedUser(
      "unfollow",
      false,
      authToken,
      displayedUser,
      (t, u) => this.service.unfollow(t, u),
    );
  }
}
