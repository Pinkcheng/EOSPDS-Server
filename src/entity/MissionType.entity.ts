import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('mission_type')
export class MissionType {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    name: 'tid'
  })
  id: string;
  
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