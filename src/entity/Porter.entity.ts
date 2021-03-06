import { PorterRepository } from '../model/Porter.model';
import { Department } from './Department.entity';
import { BeforeInsert, Column, Entity, getCustomRepository, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { PorterType } from './PorterType.entity';
import { Formatter } from '../core/Formatter';
import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

export enum PORTER_STATUS {
  'START_TO_WORK' = 1,
  'FINISH_WORK' = 2
}

@Entity('porter_list')
export class Porter {
  private mPorterType: string;

  // 傳送員編號
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'pid'
  })
  id: string;

  @BeforeInsert()
  private async beforeInsert() {
    let lastID = await getCustomRepository(PorterRepository).count();
    // 數量+1
    lastID++;
    // 補0
    const id = Formatter
      .paddingLeftZero(lastID + '', parseInt(process.env.PORTER_ID_LENGTH));

    this.id = 'P' + this.mPorterType + id;
  }

  // 傳送員姓名
  @Index({ unique: true })
  @Column('varchar', {
    length: 30,
    name: 'porter_name',
  })
  name: string;

  // 傳送員tag標籤編號
  @Index({ unique: true })
  @Column('varchar', {
    length: 25,
    name: 'tag_number',
    default: null
  })
  tagNumber: string;

  // 傳送員生日日期
  @Column('date', {
    name: 'porter_birthday',
    default: null
  })
  birthday: string;

  // 傳送員性別
  @Column('int', {
    name: 'porter_gender',
    default: null
  })
  gender: number;

  // 傳送員手機號碼
  @Column('varchar', {
    name: 'mobile',
    length: 20
  })
  mobile: string;

  @Column('varchar', {
    name: 'location',
    length: 50,
    default: null
  })
  location: string;

  @Column('timestamp', {
    name: 'location_time',
    default: () => 'CURRENT_TIMESTAMP'
  })
  locationTime: string;

  @Column('int', {
    name: 'status',
    default: PORTER_STATUS.FINISH_WORK
  })
  status: PORTER_STATUS;

  @Column('int', {
    name: 'mission',
    default: 0
  })
  mission: number;

  @ManyToOne(
    () => Department,
    deparmtnet => deparmtnet.id
  )
  department: Department;

  // 傳送員類型編號
  @ManyToOne(
    () => PorterType,
    type => type.id
  )
  type: PorterType;

  constructor(porterType: string) {
    this.mPorterType = porterType;
  }
}