import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import UserCurrency from '../database/entities/user-currency.entity';
import Currency from '../database/entities/currency.entity';
import Operation from '../database/entities/operation.entity';
import Category from '../database/entities/category.entity';
import User from '../database/entities/user.entity';

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
      // entities: ['dist/**/*.entity.{ts,js}'],
      entities: [User, UserCurrency, Currency, Operation, Category],
      autoLoadEntities: true,
      migrations: ['dist/src/database/migrations/*.{ts,js}'],
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/database/entities',
      },
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
