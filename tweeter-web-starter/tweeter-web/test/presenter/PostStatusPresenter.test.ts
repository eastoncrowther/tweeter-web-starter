import { AuthToken, User, Status } from "tweeter-shared";
import { PostPresenter, PostView } from "../../src/presenter/PostPresenter";
import { StatusService } from "../../src/model.service/StatusService";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";

describe("PostPresenter", () => {
  let mockPostView: PostView;
  let postPresenter: PostPresenter;
  let mockService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const currentUser = new User("John", "Doe", "@johndoe", "image.png");
  const postText = "This is a test post!";

  beforeEach(() => {
    mockPostView = mock<PostView>();
    const mockPostViewInstance = instance(mockPostView);

    when(mockPostView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123",
    );

    const postPresenterSpy = spy(new PostPresenter(mockPostViewInstance));
    postPresenter = instance(postPresenterSpy);

    mockService = mock<StatusService>();
    when((postPresenterSpy as any).service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    await postPresenter.submitPost(postText, currentUser, authToken);

    verify(mockPostView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postPresenter.submitPost(postText, currentUser, authToken);

    verify(mockService.postStatus(anything(), anything())).once();

    const [capturedAuthToken, capturedStatus] = capture(
      mockService.postStatus,
    ).last();

    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual(postText);
    expect(capturedStatus.user).toEqual(currentUser);
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
    await postPresenter.submitPost(postText, currentUser, authToken);

    verify(mockPostView.deleteMessage("messageId123")).once();
    verify(mockPostView.setPost("")).once();
    verify(mockPostView.displayInfoMessage("Status posted!", 2000)).once();

    verify(mockPostView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when not successful", async () => {
    const error = new Error("An error occurred");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postPresenter.submitPost(postText, currentUser, authToken);

    verify(mockPostView.deleteMessage("messageId123")).once();

    verify(
      mockPostView.displayErrorMessage(
        "Failed to post the status because of exception: An error occurred",
      ),
    ).once();

    verify(mockPostView.setPost(anything())).never();
    verify(
      mockPostView.displayInfoMessage("Status posted!", anything()),
    ).never();
  });
});
