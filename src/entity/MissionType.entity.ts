import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('mission_type')
export class MissionType {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id'
  })
  ID: number;
  
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