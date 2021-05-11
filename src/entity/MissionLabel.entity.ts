import { MissionLabelRepository } from '../model/Mission.model';
import { BeforeInsert, Column, Entity, getCustomRepository, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { MissionType } from './MissionType.entity';
import { Formatter } from '../core/Formatter';
import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

@Entity('mission_label')
export class MissionLabel {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    name: 'lid'
  })
  id: string;

  @BeforeInsert()
  private async beforeInsert() {
    let lastID = await getCustomRepository(MissionLabelRepository).count();
    // 數量+1
    lastID++;
    // 補0
    const id = Formatter
      .paddingLeftZero(lastID + '', parseInt(process.env.MISSION_LABEL_ID_LENGTH));

    this.id = 'L' + id;
  }
  
  @Index()
  @Column('varchar', {
    length: 250,
    name: 'name'
  })
  name: string;

  @ManyToOne(
    () => MissionType,
    type => type.id
  )
  type: MissionType;
}