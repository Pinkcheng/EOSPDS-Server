import { MissionProcess } from './MissionProcess.entity';
import { Department } from './Department.entity';
import { Porter } from './porter.entity';
import { MissionInstrument } from './MissionInstrument.entity';
import { MissionLabel } from './MissionLabel.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

export enum MISSION_STATUS {
  'NOT_DISPATCHED' = 1,
  'NOT_STATED' = 2,
  'IN_PROGRESS' = 3,
  'FINISH' = 4
}

@Entity('mission_list')
export class Mission {
  // 任務編號
  @PrimaryColumn('varchar', {
    length: 50,
    name: 'mid'
  })
  id: string;
  // 任務型態
  @ManyToOne(
    () => MissionLabel,
    label => label.id
  )
  label: MissionLabel;
  // 任務內容
  @Column('text', {
    name: 'content',
    default: null
  })
  content: string;
  // 任務狀態
  @Column('int', {
    name: 'status',
    default: MISSION_STATUS.NOT_DISPATCHED
  })
  status: MISSION_STATUS;
  // 任務建立時間
  @Column('timestamp', {
    name: 'create_time',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createTime: string;
  // 任務運送工具
  @ManyToOne(
    () => MissionInstrument,
    instrument => instrument.id,
  )
  instrument: MissionInstrument;
  // 傳送員
  @ManyToOne(
    () => Porter,
    porter => porter.id
  )
  porter: Porter;
  // 請求單位
  @ManyToOne(
    () => Department,
    department => department.id
  )
  startDepartment: Department;
  // 送往單位
  @ManyToOne(
    () => Department,
    department => department.id
  )
  endDepartment: Department;

  process: MissionProcess[];
}