import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";
import LoginDTO from "./login.dto";

export default class SignupDTO extends LoginDTO {
    @IsNotEmpty()
    @IsDefined()
    @MaxLength(50)
    @ApiProperty({ type: String, description: "user's first name", example: "John" })
    first_name!: string;

    @IsNotEmpty()
    @IsDefined()
    @ApiProperty({ type: String, description: "user's last name", example: "Doe" })
    @MaxLength(50)
    last_name!: string;
}
