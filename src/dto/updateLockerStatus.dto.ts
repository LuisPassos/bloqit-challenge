import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { LockerStatus } from "../enums/lockerEnums";

export class UpdateLockerStatusDTO {
  @IsNotEmpty()
  @IsEnum(LockerStatus)
  status: string;

  @IsNotEmpty()
  @IsBoolean()
  isOccupied: boolean;
}
