import { Entity, Column, ManyToMany, PrimaryColumn, JoinTable } from 'typeorm';
import { Promo } from './promo.entity';

@Entity('channels')
export class Channel {
  @PrimaryColumn({ type: 'varchar' })
  snowflake!: string;

  @Column()
  name!: string;

  @Column()
  is_public!: boolean;

  @ManyToMany(() => Promo, promo => promo.channels)
  @JoinTable({
    name: 'channels_promos',
    joinColumn: {
      name: 'channel_snowflake',
      referencedColumnName: 'snowflake'
    },
    inverseJoinColumn: {
      name: 'promo_snowflake',
      referencedColumnName: 'snowflake'
    }
  })
  promos!: Promo[];
} 