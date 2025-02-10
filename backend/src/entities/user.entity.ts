import { Entity, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Promo } from './promo.entity';

@Entity()
export class User {
  @Column({ primary: true, type: 'bigint' })
  snowflake!: number;

  @Column({ length: 255 })
  discordUsername!: string;

  @Column({ nullable: true, length: 100 })
  firstName?: string;

  @Column({ nullable: true, length: 100 })
  lastName?: string;

  @Column({ nullable: true, length: 255 })
  email?: string;

  @Column({ default: false })
  status!: boolean;

  @ManyToMany(() => Role, { eager: true, cascade: true })
  @JoinTable({ name: 'users_roles' })
  roles!: Role[];

  @ManyToOne(() => Promo, promo => promo.users)
  @JoinColumn({ name: 'promo_snowflake' })
  promo?: Promo;
} 