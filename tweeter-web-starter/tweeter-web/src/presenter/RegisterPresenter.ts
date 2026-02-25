import { Buffer } from "buffer";
import { AuthPresenter } from "./AuthPresenter";

export class RegisterPresenter extends AuthPresenter {
  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFile: File,
    rememberMe: boolean,
  ) {
    await this.doAuthOperation(
      async () => {
        const imageFileExtension = this.getFileExtension(imageFile);
        const imageBytes = await this.getFileBytes(imageFile);

        return this.service.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension,
        );
      },
      "register user",
      rememberMe,
    );
  }

  private getFileExtension(file: File): string {
    return file.name.split(".").pop() || "";
  }

  private getFileBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        resolve(bytes);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
