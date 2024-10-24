import { IsNotEmpty, IsString } from "class-validator";

export class CreateBloqDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
