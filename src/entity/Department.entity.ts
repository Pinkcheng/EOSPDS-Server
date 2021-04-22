import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('department_list')
export class Department {
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'did'
  })
  ID: string;

  @Column('varchar', {
    length: 30,
    name: 'name'
  })
  name: string;
}