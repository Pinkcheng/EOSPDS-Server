import { MissionTypegRepository } from '../model/Mission.model';
import { BeforeInsert, Column, Entity, Index, PrimaryColumn, getCustomRepository } from 'typeorm';
import { Formatter } from '../core/Formatter';

@Entity('mission_type')
export class MissionType {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    name: 'tid'
  })
  id: string;

  @BeforeInsert()
  private async beforeInsert() {
    let lastID = await getCustomRepository(MissionTypegRepository).count();
    // 數量+1
    lastID++;
    // 補0
    const id = Formatter
      .paddingLeftZero(lastID + '', parseInt(process.env.MISSION_TYPE_ID_LENGTH));

    this.id = 'T' + id;
  }
  
  @Index()
  @Column('varchar', {
    length: 100,
    name: 'name'
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'transport'
  })
  transport: string;
}