import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { Promo } from './promo.entity';
import { UserRole } from '../common/dto/role.dto';

@Entity('roles')
export class Role {
  @PrimaryColumn({ type: 'bigint' })
  snowflake!: string;

  @Column({ type: 'varchar' })
  nom!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  type!: UserRole;

  @ManyToMany(() => Promo, promo => promo.roles)
  @JoinTable({
    name: 'roles_promos',
    joinColumn: {
      name: 'role_snowflake',
      referencedColumnName: 'snowflake'
    },
    inverseJoinColumn: {
      name: 'promo_snowflake',
      referencedColumnName: 'snowflake'
    }
  })
  promos!: Promo[];
} 