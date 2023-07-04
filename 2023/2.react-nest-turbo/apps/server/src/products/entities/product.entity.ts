import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ProductImage } from "./productImage.entity"

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true
    })
    title: string

    @Column('float', {
        default: 0
    })
    price: number

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string

    @Column('text', {
        unique: true
    })
    slug: string

    @Column('int', {
        default: 0
    })
    stock: number

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string

    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[]

    @OneToMany(
        () => ProductImage,
        (images: ProductImage) => images.product,
        { cascade: true }
    )
    images?: ProductImage[]

    @BeforeInsert()
    beforeInser() {
        this.slug = this.title
            .toLocaleLowerCase()
            .replaceAll(' ', '-')
            .replaceAll('\'', '')
    }

    @BeforeUpdate()
    beforeupdate() {

        this.slug = this.title
            .replaceAll(' ', '-')
            .replaceAll('\'', '')

    }
}
