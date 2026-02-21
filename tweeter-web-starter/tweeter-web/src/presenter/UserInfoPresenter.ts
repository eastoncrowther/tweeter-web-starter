import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this._service = new FollowService();
  }

  protected get service(): FollowService {
    return this._service;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
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

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

        const [followerCount, followeeCount] = await this.service.follow(
          authToken,
          displayedUser,
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, "follow user");
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);

        const [followerCount, followeeCount] = await this.service.unfollow(
          authToken,
          displayedUser,
        );

        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, "unfollow user");
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
