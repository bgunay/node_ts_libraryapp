import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { TablesEnum } from '@database/enum/TablesEnum'
import { BorrowEntity } from './borrow.entity'

@Entity(TablesEnum.USERS)
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => BorrowEntity, (borrow) => borrow.borrowedBy)
    borrows: BorrowEntity[]

    toResponse(): Partial<UserEntity> {
        const responseUser = new UserEntity()
        responseUser.id = this.id
        responseUser.name = this.name
        return responseUser
    }
}
