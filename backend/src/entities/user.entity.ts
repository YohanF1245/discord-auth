import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Promo } from './promo.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'bigint' })
  snowflake: string;

  @Column({ type: 'varchar' })
  discord_username: string;

  @Column({ type: 'varchar' })
  nom: string;

  @Column({ type: 'varchar' })
  prenom: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @ManyToOne(() => Promo, promo => promo.users)
  @JoinColumn({ name: 'promo_snowflake' })
  promo: Promo;
} 