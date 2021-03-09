import { Entity, PrimaryColumn } from 'typeorm';

@Entity('porter_list')
export class Porter {
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'pid'
  })
  PID: string;
}