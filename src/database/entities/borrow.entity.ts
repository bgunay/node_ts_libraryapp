import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { BookEntity } from './book.entity'
import { UserEntity } from './user.entity'
import { TablesEnum } from '@database/enum/TablesEnum'

@Entity(TablesEnum.BORROWS)
export class BorrowEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ default: 0, nullable: true })
    score: number

    @ManyToOne(() => UserEntity, (user) => user.borrows)
    @JoinColumn({ name: 'borrowedById' })
    borrowedBy: UserEntity

    @ManyToOne(() => BookEntity, (book) => book.borrows)
    @JoinColumn({ name: 'bookId' })
    book: BookEntity

    @Column({ type: 'timestamp', nullable: true })
    returnDate: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    toResponse(): Partial<BorrowEntity> {
        const responseUser = new BorrowEntity()
        responseUser.id = this.id
        responseUser.borrowedBy = this.borrowedBy
        responseUser.book = this.book
        responseUser.returnDate = this.returnDate

        return responseUser
    }
}
