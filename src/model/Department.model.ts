import { Department } from './../entity/Department.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

@EntityRepository(Department)
export class DepartmentRepository extends Repository<Department> {
  findByID(id: string) {
    return this.findOne({ id });
  }

  getAll() {
    const departmentList = this.createQueryBuilder('department')
      .getMany();

    return departmentList;
  }

  del(id: string) {
    this.createQueryBuilder('department')
      .delete()
      .where({ id })
      .execute();
  }
}

export class DepartmentModel {
  private mDepartmentRepo = getCustomRepository(DepartmentRepository);

  constructor() {
    this.mDepartmentRepo = getCustomRepository(DepartmentRepository);
  }

  create(id: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartment = await this.mDepartmentRepo.findOne({ id });
        if (findDepartment) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newDepartment = new Department();
          newDepartment.id = id;
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

  async del(id: string) {
    return await this.mDepartmentRepo.del(id);
  }

  update(id: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartment = await this.mDepartmentRepo.findOne({ id });
        if (!findDepartment) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          findDepartment.id = id;
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

  async findByID(id: string) {
    const department = await this.mDepartmentRepo.findByID(id);
    return department;
  }
}