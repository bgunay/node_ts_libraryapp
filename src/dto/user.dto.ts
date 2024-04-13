import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class UserDto {
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    name: string
}
