import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();

export const connectionSource: DataSourceOptions = {
  type: 'mysql',
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),
  logging: true,
  synchronize: true,
  migrationsRun: true,
  migrationsTableName: 'migrations_typeorm',
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/**/*.entity.js'],
};

const dataSource = new DataSource(connectionSource);
export default dataSource;
