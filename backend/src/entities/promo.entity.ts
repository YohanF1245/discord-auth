import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';
import { Role } from './role.entity';

@Entity('promos')
export class Promo {
  @PrimaryColumn({ type: 'bigint' })
  snowflake: string;

  @Column({ type: 'varchar' })
  nom: string;

  @OneToMany(() => User, user => user.promo)
  users: User[];

  @ManyToMany(() => Channel)
  @JoinTable({
    name: 'promo_channels',
    joinColumn: { name: 'promo_snowflake', referencedColumnName: 'snowflake' },
    inverseJoinColumn: { name: 'channel_snowflake', referencedColumnName: 'snowflake' }
  })
  channels: Channel[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'promo_roles',
    joinColumn: { name: 'promo_snowflake', referencedColumnName: 'snowflake' },
    inverseJoinColumn: { name: 'role_snowflake', referencedColumnName: 'snowflake' }
  })
  roles: Role[];
} 