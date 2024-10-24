import { IsEnum, IsNotEmpty } from "class-validator";
import { RentStatus } from "../enums/rentEnums";

export class UpdateRentStatusDTO {
  @IsNotEmpty()
  @IsEnum(RentStatus)
  status: string;
}
