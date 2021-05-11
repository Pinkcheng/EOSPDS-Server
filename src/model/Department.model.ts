import { Department } from './../entity/Department.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';
import { Formatter } from '../core/Formatter';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

@EntityRepository(Department)
export class DepartmentRepository extends Repository<Department> {
  findByID(id: string) {
    return this.findOne({ id });
  }

  getAll() {
    const departmentList = this.createQueryBuilder('department')
      .orderBy('department.id', 'ASC')
      .getMany();

    return departmentList;
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
        if (findDepartment) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newDepartment = new Department(buildingID, floor);
          // newDepartment.id = await this.generaterID(buildingID, floor);
          newDepartment.name = name;

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

  async getAll() {
    const departmentList = await this.mDepartmentRepo.getAll();
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