import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.DONE })
  status: string;

  @Column({ default: '' })
  user_token: string;
}
