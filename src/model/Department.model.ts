import { Department } from './../entity/Department.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

@EntityRepository(Department)
export class DepartmentRepository extends Repository<Department> {
  findByID(ID: string) {
    return this.findOne({ ID });
  }

  getAll() {
    const departmentList = this.createQueryBuilder('department')
      .getMany();

    return departmentList;
  }

  del(ID: string) {
    this.createQueryBuilder('department')
      .delete()
      .where({ ID })
      .execute();
  }
}

export class DepartmentModel {
  private mDepartmentRepo = getCustomRepository(DepartmentRepository);

  constructor() {
    this.mDepartmentRepo = getCustomRepository(DepartmentRepository);
  }

  create(ID: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!ID || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartment = await this.mDepartmentRepo.findOne({ ID });
        if (findDepartment) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newDepartment = new Department();
          newDepartment.ID = ID;
          newDepartment.name = name;
    
          try {
            await this.mDepartmentRepo.save(newDepartment);
            resolve(RESPONSE_STATUS.DATA_SUCCESS);
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

  async del(ID: string) {
    return await this.mDepartmentRepo.del(ID);
  }

  update(ID: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!ID || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartment = await this.mDepartmentRepo.findOne({ ID });
        if (!findDepartment) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          findDepartment.ID = ID;
          findDepartment.name = name;
    
          try {
            await this.mDepartmentRepo.save(findDepartment);
            resolve(RESPONSE_STATUS.DATA_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async findByID(ID: string) {
    const department = await this.mDepartmentRepo.findByID(ID);
    return department;
  }
}