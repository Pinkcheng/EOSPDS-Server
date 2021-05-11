import { Building } from './Building.entity';
import { DepartmentRepository } from './../model/Department.model';
import { BeforeInsert, Column, Entity, getCustomRepository, ManyToOne, PrimaryColumn } from 'typeorm';
import { Formatter } from '../core/Formatter';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

@Entity('department_list')
export class Department {
  private mBuildingID: string;
  private mFloor: string;

  @PrimaryColumn('varchar', {
    length: 10,
    name: 'did'
  })
  id: string;

  @BeforeInsert()
  private async beforeInsert() {
    this.mBuildingID = parseInt(this.mBuildingID.split('B')[1]) + '';
    this.mBuildingID = Formatter
      .paddingLeftZero(this.mBuildingID, parseInt(process.env.DEPARTMENT_ID_BUDING_LENGTH));
    this.mFloor = Formatter
      .paddingLeftZero(this.mFloor, parseInt(process.env.DEPARTMENT_ID_FLOOR_LENGTH));

    const generaterID = `D${this.mBuildingID}${this.mFloor}`;
    let lastID = await getCustomRepository(DepartmentRepository).count();

    // 數量+1
    lastID++;
    // 補0
    const id = Formatter
      .paddingLeftZero(lastID + '', parseInt(process.env.DEPARTMENT_ID_ID_LENGTH));

    this.id = generaterID + id;
  }

  @Column('varchar', {
    length: 30,
    name: 'name'
  })
  name: string;

  @Column('varchar', {
    name: 'floor'
  }) 
  floor: string;

  @ManyToOne(
    () => Building,
    building => building.id
  )
  building: Building;

  constructor(buildingID?: string, floor?: string) {
    this.mBuildingID = buildingID;
    this.mFloor = floor;
  }
}