import { BuildingModel } from './Building.model';
import { Department } from './../entity/Department.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

@EntityRepository(Department)
export class DepartmentRepository extends Repository<Department> {
  findByID(id: string) {
    const department = this.createQueryBuilder('department')
      .orderBy('department.id', 'ASC')
      .leftJoinAndSelect('department.building', 'building')
      .where({ id })
      .getOne();

    return department;
  }

  getAll(building: string) {
    const departmentList = this.createQueryBuilder('department')
      .orderBy('department.id', 'ASC')
      .leftJoinAndSelect('department.building', 'building');

    if (building) {
      departmentList.where(`department.building = '${building}'`);
    }

    return departmentList.getMany();
  }

  del(id: string) {
    this.createQueryBuilder('department')
      .delete()
      .where({ id })
      .execute();
  }

  findByNameWithoutMyself(searchName: string, myselfID: string) {
    const list = this.createQueryBuilder('department')
      .where(`department.name = '${searchName}'`)
      .andWhere(`department.id != '${myselfID}'`)
      .getOne();

    return list;
  }
}

export class DepartmentModel {
  private mDepartmentRepo = getCustomRepository(DepartmentRepository);

  constructor() {
    this.mDepartmentRepo = getCustomRepository(DepartmentRepository);
  }

  create(
    buildingID: string,
    floor: string,
    name: string
  ) {
    return new Promise<any>(async (resolve, reject) => {
      if (!name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartment = await this.mDepartmentRepo.findOne({ name });
        const findBuilding = await new BuildingModel().get(buildingID);

        if (findDepartment) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else if (!findBuilding) {
          reject(RESPONSE_STATUS.DATA_CREATE_FAIL);
          return;
        } else {
          const newDepartment = new Department(buildingID, floor);
          newDepartment.name = name;
          newDepartment.building = findBuilding;
          if (floor === '0') {
            newDepartment.floor = 'B1';
          } else {
            newDepartment.floor = floor + 'F';
          }

          try {
            await this.mDepartmentRepo.save(newDepartment);
            resolve(RESPONSE_STATUS.DATA_CREATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async getAll(building: string) {
    const departmentList = await this.mDepartmentRepo.getAll(building);
    return departmentList;
  }

  async del(id: string) {
    return await this.mDepartmentRepo.del(id);
  }

  update(id: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartmentByID = await this.mDepartmentRepo.findOne({ id });
        const findDepartmentByName = await this.mDepartmentRepo
          .findByNameWithoutMyself(name, id);

        if (!findDepartmentByID) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else if (findDepartmentByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          findDepartmentByID.name = name;

          try {
            await this.mDepartmentRepo.save(findDepartmentByID);
            resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async findByID(id: string) {
    const department = await this.mDepartmentRepo.findByID(id);
    return department;
  }
}