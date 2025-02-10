import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../entities/user.entity';
import { Promo } from '../entities/promo.entity';
import { Channel } from '../entities/channel.entity';
import { Role } from '../entities/role.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'discord_auth',
  entities: [User, Promo, Channel, Role],
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export const discordConfig = {
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:3000/auth/discord/callback',
  scope: ['identify', 'email'],
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'your-secret-key',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION || '1d',
  },
};

export const appConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
}; 