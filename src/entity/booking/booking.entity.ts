import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  singer: string;

  @Column('simple-array')
  date_list: string;

  @Column('simple-array')
  seat_list: string[];
}
