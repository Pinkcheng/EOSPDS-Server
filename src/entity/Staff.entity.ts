import { BeforeInsert, Column, Entity, getCustomRepository, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { Department } from './Department.entity';
import { Formatter } from '../core/Formatter';
import dotenv from 'dotenv';
import { StaffRepository } from '../model/Staff.model';
// Read .env files settings
dotenv.config();

@Entity('staff_list')
export class Staff {
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'sid'
  })
  id: string;

  @BeforeInsert()
  private async beforeInsert() {
    let lastID = await getCustomRepository(StaffRepository).count();
    // 數量+1
    lastID++;
    // 補0
    const id = Formatter
      .paddingLeftZero(lastID + '', parseInt(process.env.STAFF_ID_LENGTH));

    this.id = 'S' + id;
  }

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