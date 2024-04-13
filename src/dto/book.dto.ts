import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class BookDto {
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name: string
}
