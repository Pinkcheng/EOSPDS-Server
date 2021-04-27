import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('department_list')
export class Department {
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'did'
  })
  id: string;

  @Column('varchar', {
    length: 30,
    name: 'name'
  })
  name: string;
}