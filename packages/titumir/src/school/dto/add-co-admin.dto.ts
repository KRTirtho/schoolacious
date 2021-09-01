import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export default class AddCoAdminDTO {
    @IsDefined()
    @IsNumber()
    @IsPositive()
    @ApiProperty({ enum: [1, 2] })
    index!: 1 | 2;

    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: "the email of the user, who'll be a co-admin",
    })
    email!: string;
}
