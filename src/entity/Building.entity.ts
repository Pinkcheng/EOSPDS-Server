import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('building_list')
export class Building {
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'bid'
  })
  ID: string;

  @Column('varchar', {
    length: 30,
    name: 'name'
  })
  name: string;
}