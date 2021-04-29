import { Department } from './Department.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  status: string;

  @Column('datetime', {
    name: 'name'
  })
  time: string;

  @ManyToOne(
    () => Department,
    department => department.id
  )
  department: Department;

  // TODO: 加上department和(handover)交接班單位人員欄位

}