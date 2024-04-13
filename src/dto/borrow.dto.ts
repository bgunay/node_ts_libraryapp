import { IsNotEmpty } from 'class-validator'

export class BorrowDto {
    @IsNotEmpty()
    score: number
}
