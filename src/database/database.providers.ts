import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
// Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.

export const databaseProviders = [
  {
    module: [ConfigModule],
    inject: [ConfigService],
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: Number(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      });

      return dataSource.initialize();
    },
  },
];
// export class DatabaseManager {
//   providers;
//   constructor(private datebaseProviders) {
//     this.providers = databaseProviders;
//   }

//   getProviders() {
//     return [...this.providers];
//   }
// }
