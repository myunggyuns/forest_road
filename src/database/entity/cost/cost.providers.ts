import { DataSource } from 'typeorm';
import { Cost } from './cost.entity';

export const costProviders = [
  {
    provide: 'COST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Cost),
    inject: ['DATA_SOURCE'],
  },
];
