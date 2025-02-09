import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';
import { Promo } from './promo.entity';

@Entity('roles')
export class Role {
  @PrimaryColumn({ type: 'bigint' })
  snowflake: string;

  @Column({ type: 'varchar' })
  nom: string;

  @Column({ type: 'varchar' })
  type: 'admin' | 'formateur' | 'charge_projet' | 'etudiant';

  @ManyToMany(() => Promo, promo => promo.roles)
  promos: Promo[];
} 