import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateLockerDTO {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  bloqId: string;
}
