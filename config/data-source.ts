import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './database.config';

ConfigModule.forRoot();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default new DataSource(new DatabaseConfig().createTypeOrmOptions());
