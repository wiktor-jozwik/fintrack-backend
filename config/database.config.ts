import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class DatabaseConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: true,
      synchronize: false,
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/src/database/migrations/*.{ts,js}'],
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/database/entities',
      },
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}

import { registerAs } from '@nestjs/config';

// export default registerAs('database', () => {
//   return {
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT || '5432'),
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     logging: true,
//     synchronize: false,
//     entities: ['dist/**/*.entity.{ts,js}'],
//     migrations: ['dist/src/database/migrations/*.{ts,js}'],
//     cli: {
//       migrationsDir: 'src/database/migrations',
//       entitiesDir: 'src/database/entities',
//     },
//     namingStrategy: new SnakeNamingStrategy(),
//   };
// });
