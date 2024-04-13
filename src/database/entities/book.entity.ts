import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { TablesEnum } from '@database/enum/TablesEnum'
import { BorrowEntity } from './borrow.entity'

@Entity(TablesEnum.BOOKS)
export class BookEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    name: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => BorrowEntity, (borrow) => borrow.book)
    borrows: BorrowEntity[]

    toPayload(): Partial<BookEntity> {
        return {
            id: this.id,
            name: this.name,
        }
    }
}
