import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  booking_date: string;

  @Column()
  booking_seat_num: string;
}
