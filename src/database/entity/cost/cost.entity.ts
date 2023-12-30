import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Cost {
  @PrimaryGeneratedColumn()
  cost_id: number;

  @Column()
  amount: number;

  @Column()
  booking_date: string;

  @Column()
  booking_seat_num: string;

  @OneToOne(() => User, (User) => User.cost)
  user: User;
}
