import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { Department } from './Department.entity';

@Entity('staff_list')
export class Staff {
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'sid'
  })
  id: string;

  @Column('varchar', {
    length: 20,
    name: 'professional'
  })
  professional: string;

  @Column('varchar', {
    length: 20,
    name: 'name'
  })
  name: string;

  @Column('int', {
    name: 'handover',
    default: 0
  })
  handover: number;

  @ManyToOne(
    () => Department,
    department => department.id
  )
  department: Department;
}