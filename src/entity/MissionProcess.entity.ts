import { Department } from './Department.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum MISSION_PROCESS_STATUS {
  'ADD' = 'add',
  'START' = 'start',
  'IN_PROGRESS' = 'in_progress',
  'FINISH' = 'finish'
}
@Entity('mission_process')
export class MissionProcess {
  @PrimaryGeneratedColumn({
    name: 'id'
  })
  id: number;

  @Column('varchar', {
    length: 50,
    name: 'mid'
  })
  mid: string;

  @Column('varchar', {
    length: 20,
    name: 'status'
  })
  status: MISSION_PROCESS_STATUS;

  @Column('timestamp', {
    name: 'time',
    default: null
  })
  time: string;

  @Column('varchar', {
    name: 'handover',
    length: 10,
    default: null
  })
  handover: string;

}