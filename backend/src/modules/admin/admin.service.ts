import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Promo } from '../../entities/promo.entity';
import { Channel } from '../../entities/channel.entity';
import { Role } from '../../entities/role.entity';
import { UserRole } from '../../common/dto/role.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async populateDatabase(userSnowflake: string) {
    // Vérifie si l'utilisateur est admin
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.snowflake = :snowflake', { snowflake: Number(userSnowflake) })
      .getOne();

    if (!user) {
      throw new ForbiddenException('Utilisateur non trouvé');
    }

    // Si la base de données est vide (pas de rôles), on autorise le premier utilisateur à peupler
    const existingRoles = await this.roleRepository.count();
    if (existingRoles > 0 && (!user.roles || !user.roles.some(role => role.type === UserRole.ADMIN))) {
      throw new ForbiddenException('Seuls les administrateurs peuvent peupler la base de données');
    }

    // Création des rôles
    const roles = await Promise.all([
      this.roleRepository.save({
        snowflake: '123456789',
        nom: 'Super Admin',
        type: UserRole.ADMIN,
      }),
      this.roleRepository.save({
        snowflake: '987654321',
        nom: 'Formateur JavaScript',
        type: UserRole.FORMATEUR,
      }),
      this.roleRepository.save({
        snowflake: '456789123',
        nom: 'Chef de Projet',
        type: UserRole.CHARGE_PROJET,
      }),
      this.roleRepository.save({
        snowflake: '789123456',
        nom: 'Étudiant',
        type: UserRole.ETUDIANT,
      }),
    ]);

    // Création des promos avec des noms amusants
    const promos = await Promise.all([
      this.promoRepository.save({
        snowflake: 111111111,
        name: 'Les Ninjas du Code 🥷',
        roles: [roles[1], roles[2], roles[3]],
      }),
      this.promoRepository.save({
        snowflake: 222222222,
        name: 'Les Magiciens du JavaScript 🧙‍♂️',
        roles: [roles[1], roles[2], roles[3]],
      }),
      this.promoRepository.save({
        snowflake: 333333333,
        name: 'Les Pirates du Web 🏴‍☠️',
        roles: [roles[1], roles[2], roles[3]],
      }),
    ]);

    // Création des channels
    const channels = await Promise.all([
      this.channelRepository.save({
        snowflake: '11111',
        name: '📢-annonces',
        is_public: true,
        promos: promos,
      }),
      this.channelRepository.save({
        snowflake: '22222',
        name: '💬-général',
        is_public: true,
        promos: promos,
      }),
      this.channelRepository.save({
        snowflake: '33333',
        name: '🎮-pause-café',
        is_public: true,
        promos: promos,
      }),
      ...promos.map(promo => 
        this.channelRepository.save({
          snowflake: `${promo.snowflake}-1`,
          name: `📚-cours-${promo.name.toLowerCase().replace(/\s+/g, '-')}`,
          is_public: false,
          promos: [promo],
        })
      ),
    ]);

    // Création des utilisateurs
    const users = await Promise.all([
      this.userRepository.save({
        snowflake: 444444444,
        discordUsername: 'SuperDev42',
        firstName: 'Alice',
        lastName: 'Wonder',
        email: 'alice@example.com',
        status: true,
        roles: [roles[3]],
        promo: promos[0],
      }),
      this.userRepository.save({
        snowflake: 555555555,
        discordUsername: 'CodeMaster',
        firstName: 'Bob',
        lastName: 'Builder',
        email: 'bob@example.com',
        status: false,
        roles: [roles[3]],
        promo: promos[1],
      }),
      this.userRepository.save({
        snowflake: 666666666,
        discordUsername: 'BugHunter',
        firstName: 'Charlie',
        lastName: 'Debug',
        email: 'charlie@example.com',
        status: true,
        roles: [roles[3]],
        promo: promos[2],
      }),
      this.userRepository.save({
        snowflake: 777777777,
        discordUsername: 'TeachMaster',
        firstName: 'David',
        lastName: 'Code',
        email: 'david@example.com',
        status: true,
        roles: [roles[1]],
        promo: promos[0],
      }),
      this.userRepository.save({
        snowflake: 888888888,
        discordUsername: 'ProjectLead',
        firstName: 'Eve',
        lastName: 'Manager',
        email: 'eve@example.com',
        status: true,
        roles: [roles[2]],
        promo: promos[1],
      }),
    ]);

    return {
      message: 'Base de données peuplée avec succès',
      data: {
        roles,
        promos,
        channels,
        users,
      },
    };
  }
} 