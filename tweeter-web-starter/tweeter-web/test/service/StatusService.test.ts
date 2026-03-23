import "isomorphic-fetch";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken } from "tweeter-shared";

describe("StatusService", () => {
  let statusService: StatusService;

  beforeAll(() => {
    statusService = new StatusService();
  });

  it("should successfully retrieve a user's story pages", async () => {
    // Generate a dummy AuthToken
    const dummyAuthToken = AuthToken.Generate();
    const userAlias = "@dummyUser";
    const pageSize = 10;
    
    // Call loadMoreStoryItems which returns an array of statuses and a hasMorePages boolean
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      dummyAuthToken,
      userAlias,
      pageSize,
      null
    );

    // Verify results
    expect(statuses).toBeDefined();
    expect(statuses.length).toBeGreaterThan(0);
    expect(typeof hasMore === "boolean").toBe(true);

    // We can also check if the first item has the expected structure
    const firstStatus = statuses[0];
    expect(firstStatus.post).toBeDefined();
    expect(firstStatus.user).toBeDefined();
    expect(firstStatus.timestamp).toBeDefined();
  });
});
