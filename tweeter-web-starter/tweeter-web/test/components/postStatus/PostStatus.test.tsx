import userEvent from "@testing-library/user-event";
import { mock, instance, verify } from "@typestrong/ts-mockito";
import { render, screen } from "@testing-library/react";
import { User, AuthToken } from "tweeter-shared";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { PostPresenter } from "../../../src/presenter/PostPresenter";
import "@testing-library/jest-dom";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUserInstance = new User(
    "firstName",
    "lastName",
    "@alias",
    "image.png",
  );
  const mockAuthTokenInstance = new AuthToken("token", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with the Post Status and Clear buttons disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "Hello world!");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "Hello world!");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's submitPost method with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postButton, textField, user } = renderPostStatusAndGetElements(
      mockPresenterInstance,
    );

    const postText = "Hello world!";
    await user.type(textField, postText);
    await user.click(postButton);

    verify(
      mockPresenter.submitPost(
        postText,
        mockUserInstance,
        mockAuthTokenInstance,
      ),
    ).once();
  });
});

function renderPostStatus(presenter?: PostPresenter) {
  return render(<PostStatus presenter={presenter} />);
}

function renderPostStatusAndGetElements(presenter?: PostPresenter) {
  const user = userEvent.setup();
  renderPostStatus(presenter);

  const textField = screen.getByRole("textbox");
  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });

  return { textField, postButton, clearButton, user };
}
