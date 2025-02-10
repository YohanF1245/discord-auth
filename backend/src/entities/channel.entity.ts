import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, PrimaryColumn } from 'typeorm';
import { Promo } from './promo.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  snowflake: string;

  @Column()
  name: string;

  @Column()
  is_public: boolean;

  @ManyToMany(() => Promo, promo => promo.channels)
  promos: Promo[];
} 