import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DateList } from '@/type/entity.type';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  singer: string;

  @Column({ type: 'json' })
  date_list: DateList[];
}
