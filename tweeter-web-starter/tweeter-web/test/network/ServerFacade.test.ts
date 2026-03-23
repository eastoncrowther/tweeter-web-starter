import "isomorphic-fetch";
import { ServerFacade } from "../../src/model.service/net/ServerFacade";
import { RegisterRequest, GetFollowersRequest, GetFollowerCountRequest, User } from "tweeter-shared";

describe("ServerFacade", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  it("should register a user successfully", async () => {
    const request: RegisterRequest = {
      token: "dummy_token",
      firstName: "Test",
      lastName: "User",
      alias: "@test",
      password: "password",
      userImageBytes: "bytes",
      imageFileExtension: "png",
    };

    const [user, token] = await serverFacade.register(request);

    expect(user).toBeDefined();
    expect(user.firstName).toEqual("Allen");
    expect(user.lastName).toEqual("Anderson");
    expect(token).toBeDefined();
    expect(token.token).toBeDefined();
  });

  it("should load more followers successfully", async () => {
    const request: GetFollowersRequest = {
      token: "dummy_token",
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.loadMoreFollowers(request);

    expect(followers).toBeDefined();
    expect(followers.length).toBeGreaterThan(0);
    expect(typeof hasMore === "boolean").toBe(true);
  });

  it("should get follower count successfully", async () => {
    const dummyUser = new User("Allen", "Anderson", "@allen", "imageUrl");
    const request: GetFollowerCountRequest = {
      token: "dummy_token",
      user: dummyUser.dto,
    };

    const count = await serverFacade.getFollowerCount(request);

    expect(count).toBeDefined();
    expect(typeof count === "number").toBe(true);
    expect(count).toBeGreaterThan(0);
  });
});
