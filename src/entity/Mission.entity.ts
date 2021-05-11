import { MissionRepository } from '../model/Mission.model';
import { MissionProcess } from './MissionProcess.entity';
import { Department } from './Department.entity';
import { Porter } from './Porter.entity';
import { MissionInstrument } from './MissionInstrument.entity';
import { MissionLabel } from './MissionLabel.entity';
import { BeforeInsert, Column, Entity, getCustomRepository, ManyToOne, PrimaryColumn } from 'typeorm';
import { Formatter } from '../core/Formatter';
import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

export enum MISSION_STATUS {
  'NOT_DISPATCHED' = 1,
  'NOT_STATED' = 2,
  'IN_PROGRESS' = 3,
  'FINISH' = 4
}

@Entity('mission_list')
export class Mission {
  private mTransport: string;
  private mMissionType: string;
  private mMissionLabel: string;
  private mDate: string;

  // 任務編號
  @PrimaryColumn('varchar', {
    length: 50,
    name: 'mid'
  })
  id: string;

  @BeforeInsert()
  private async beforeInsert() {
    this.mMissionType = parseInt(this.mMissionType.split('T')[1]) + '';
    this.mMissionType = Formatter
      .paddingLeftZero(this.mMissionType, parseInt(process.env.MISSION_TYPE_ID_LENGTH));
    this.mMissionLabel = parseInt(this.mMissionLabel.split('L')[1]) + '';
    this.mMissionLabel = Formatter
      .paddingLeftZero(this.mMissionLabel, parseInt(process.env.MISSION_LABEL_ID_LENGTH));

    const generaterID = `M${this.mTransport}${this.mMissionType}${this.mMissionLabel}${this.mDate}`;
    let lastID = await getCustomRepository(MissionRepository).count();

    // 數量+1
    lastID++;
    // 補0
    const id = Formatter
      .paddingLeftZero(lastID + '', parseInt(process.env.MISSION_ID_LENGTH));

    this.id = generaterID + id;
  }
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

  constructor(transport?: string, missionType?: string, missionLabel?: string, date?: string) {
    this.mTransport = transport;
    this.mMissionType = missionType;
    this.mMissionLabel = missionLabel;
    this.mDate = date;
  }
}