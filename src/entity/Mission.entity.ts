import { Porter } from './porter.entity';
import { MissionInstrument } from './MissionInstrument.entity';
import { MissionLabel } from './MissionLabel.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

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
    default: 1
  })
  status: number;
  // 任務運送工具
  @ManyToOne(
    () => MissionInstrument,
    instrument => instrument.id,
  )
  instrument: MissionInstrument;

  @ManyToOne(
    () => Porter,
    porter => porter.id
  )
  porter: Porter;
}