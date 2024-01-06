import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cost } from '../cost/cost.entity';

export enum UserStatus {
  WAIT = 'wait',
  WORK = 'work',
  DONE = 'done',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  uuid: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @OneToOne(() => Cost)
  @JoinColumn([{ name: 'cost_id' }])
  cost: Cost;
}
