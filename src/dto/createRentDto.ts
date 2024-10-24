import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";
import { RentSize } from "../enums/rentEnums";

export class CreateRentDTO {
  @IsNotEmpty()
  @IsPositive()
  weight: number;

  @IsNotEmpty()
  @IsEnum(RentSize)
  size: RentSize;
}
