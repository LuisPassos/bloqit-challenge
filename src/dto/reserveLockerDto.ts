import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ReserveLockerDTO {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  lockerId: string;
}
