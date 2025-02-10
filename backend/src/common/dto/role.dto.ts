import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  FORMATEUR = 'formateur',
  CHARGE_PROJET = 'charge_projet',
  ETUDIANT = 'etudiant',
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  snowflake!: string;

  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsEnum(UserRole)
  type!: UserRole;
}

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsEnum(UserRole)
  type!: UserRole;
}

export class RoleResponseDto {
  @IsString()
  snowflake!: string;

  @IsString()
  nom!: string;

  @IsEnum(UserRole)
  type!: UserRole;
} 