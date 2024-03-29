import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();

export const connectionSource: DataSourceOptions = {
  type: 'mysql',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_NAME'),
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'typeorm_migrations',
  migrations: [__dirname + './migrations/*{.ts,.js}'],
  entities: ['dist/**/*.entity.js'],
};

const dataSource = new DataSource(connectionSource);
export default dataSource;
