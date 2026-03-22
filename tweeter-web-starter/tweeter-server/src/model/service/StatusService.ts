export class StatusService {
  public async postStatus(
    token: string,
    post: string,
    userAlias: string,
    timestamp: number
  ): Promise<void> {
    // For milestone 3, this is a no-op
    // In a real implementation, this would save the status to the database
  }
}
