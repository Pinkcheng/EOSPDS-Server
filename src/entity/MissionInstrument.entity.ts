import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('mission_instrument')
export class MissionInstrument {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    name: 'iid'
  })
  id: string;
  
  @Index()
  @Column('varchar', {
    length: 100,
    name: 'name'
  })
  name: string;
}