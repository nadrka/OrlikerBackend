export default class ExpectedError extends Error {
  errorCode = 0;
  constructor(message: string, errorCode: number) {
    super(message);
    this.errorCode = errorCode;
  }
}
