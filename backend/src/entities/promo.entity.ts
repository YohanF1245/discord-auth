import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';
import { Role } from './role.entity';

@Entity('promos')
export class Promo {
  @PrimaryColumn({ type: 'bigint' })
  snowflake!: number;

  @Column()
  name!: string;

  @ManyToMany(() => Role, role => role.promos)
  roles: Role[];

  @ManyToMany(() => Channel, channel => channel.promos)
  channels: Channel[];

  @OneToMany(() => User, user => user.promo)
  users!: User[];
} 