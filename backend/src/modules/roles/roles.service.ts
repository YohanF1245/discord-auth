import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto, UserRole } from '../../common/dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find();
    return roles.map(role => this.toResponseDto(role));
  }

  async findOne(snowflake: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({ where: { snowflake } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return this.toResponseDto(role);
  }

  async create(data: CreateRoleDto): Promise<RoleResponseDto> {
    const role = this.roleRepository.create({
      snowflake: data.snowflake,
      nom: data.nom,
      type: data.type,
      promos: [],
    });
    const savedRole = await this.roleRepository.save(role);
    return this.toResponseDto(savedRole);
  }

  async update(snowflake: string, data: UpdateRoleDto, userSnowflake: string): Promise<RoleResponseDto> {
    // Vérifie si l'utilisateur est admin
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: Number(userSnowflake) })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!user) {
      throw new ForbiddenException('Seuls les administrateurs peuvent modifier des rôles');
    }

    const role = await this.roleRepository.findOne({ where: { snowflake } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    role.nom = data.nom;
    role.type = data.type;
    const updatedRole = await this.roleRepository.save(role);
    return this.toResponseDto(updatedRole);
  }

  async delete(snowflake: string, userSnowflake: string): Promise<void> {
    // Vérifie si l'utilisateur est admin
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.promo', 'promo')
      .leftJoinAndSelect('promo.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: Number(userSnowflake) })
      .andWhere('role.type = :type', { type: 'admin' })
      .getOne();

    if (!user) {
      throw new ForbiddenException('Seuls les administrateurs peuvent supprimer des rôles');
    }

    const role = await this.roleRepository.findOne({ where: { snowflake } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    await this.roleRepository.remove(role);
  }

  private toResponseDto(role: Role): RoleResponseDto {
    const roleType = role.type as UserRole;
    return {
      snowflake: role.snowflake,
      nom: role.nom,
      type: roleType,
    };
  }
} 