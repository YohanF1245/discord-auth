import { DataSource } from 'typeorm';
import { databaseConfig } from './src/config/config';

export default new DataSource({
  ...databaseConfig,
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
} as any); 