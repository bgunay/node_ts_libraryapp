import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class UserDto {
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name: string
}
