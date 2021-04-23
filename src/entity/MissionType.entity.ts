import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mission_type')
export class MissionType {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id'
  })
  ID: number;
  
  @Column('varchar', {
    length: 100,
    name: 'name'
  })
  name: string;
}