import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PORTER_STATUS } from './Porter.entity';

@Entity('porter_punch_log')

export class PorterPunchLog {
  @PrimaryGeneratedColumn({
    name: 'id'
  })
  id: number;

  // 打卡時間紀錄
  @Column('timestamp', {
    name: 'time',
    default: () => 'CURRENT_TIMESTAMP'
  })
  time: string;

  @Column('int', {
    name: 'status',
    default: PORTER_STATUS.FINISH_WORK
  })
  status: PORTER_STATUS;

  @Column('varchar', {
    name: 'porter',
    length: 10
  })
  porter: string;
}