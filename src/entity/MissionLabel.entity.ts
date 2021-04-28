import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { MissionType } from './MissionType.entity';

@Entity('mission_label')
export class MissionLabel {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    name: 'lid'
  })
  id: string;
  
  @Index()
  @Column('varchar', {
    length: 250,
    name: 'name'
  })
  name: string;

  @ManyToOne(
    () => MissionType,
    transport => transport.id
  )
  type: MissionType;
}