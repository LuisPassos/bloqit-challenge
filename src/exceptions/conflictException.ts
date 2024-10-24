export class ConflictException extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.status = 409;
  }
}