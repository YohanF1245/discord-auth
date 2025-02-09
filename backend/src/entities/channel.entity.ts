import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';
import { Promo } from './promo.entity';

@Entity('channels')
export class Channel {
  @PrimaryColumn({ type: 'bigint' })
  snowflake: string;

  @Column({ type: 'varchar' })
  nom: string;

  @Column({ type: 'boolean', default: false })
  is_public: boolean;

  @ManyToMany(() => Promo, promo => promo.channels)
  promos: Promo[];
} 