import { Department } from './../entity/Department.entity';
import { DepartmentModel } from './Department.model';
import { Formatter } from './../core/Formatter';
import { Staff } from './../entity/Staff.entity';
import { SYSTEM_PERMISSION } from './../entity/SystemPermission.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';
import { UserModel } from './User.model';

@EntityRepository(Staff)
export class StaffRepository extends Repository<Staff> {
  findByID(id: string) {
    const staff = this.createQueryBuilder('staff')
      .leftJoinAndSelect('staff.type', 'type')
      .where({ id })
      .getOne();

    return staff;
  }

  findStaffList(department: Department): Promise<Staff[]> {
    const staffs = this.createQueryBuilder('staff')
      .leftJoinAndSelect('staff.type', 'type')
      .where({ type: department })
      .orderBy('porter.id', 'ASC')
      .getMany();

    return staffs;
  }

  del(id: string) {
    this.createQueryBuilder('staff')
      .delete()
      .where({ id })
      .execute();
  }

  findByNameWithoutMyself(searchName: string, myselfID: string) {
    const list = this.createQueryBuilder('staff')
      .where(`staff.name = '${searchName}'`)
      .andWhere(`staff.id != '${myselfID}'`)
      .getOne();

    return list;
  }
}

export class StaffModel {
  private mStaffRepo: StaffRepository;

  constructor() {
    this.mStaffRepo = getCustomRepository(StaffRepository);
  }

  create(
    name: string,
    account: string,
    password: string,
    professional: string,
    departmentID: string
  ) {
    return new Promise<RESPONSE_STATUS>(async (resolve, reject) => {
      if (!name || !professional || !departmentID) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartmentByID = await new DepartmentModel().findByID(departmentID);
        const findStaffByName = await this.mStaffRepo.findOne({ name });

        if (!findDepartmentByID) {
          reject(RESPONSE_STATUS.DATA_CREATE_FAIL);
          return;
        } else if (findStaffByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const userModel = new UserModel();
          const newStaff = new Staff();
          const newStaffID = await this.generaterID();

          userModel.create(
            newStaffID, account, password, SYSTEM_PERMISSION.DEPARTMENT)
            .then(() => {
              // 新增帳號成功，新增員工
              newStaff.id = newStaffID;
              newStaff.name = name;
              newStaff.professional = professional;
              newStaff.type = findDepartmentByID;

              return this.mStaffRepo.save(newStaff);
            }, responseCode => {
              // 新增帳號失敗
              reject(responseCode);
              return;
            }).then(() => {
              resolve(RESPONSE_STATUS.USER_SUCCESS);
            }).catch(err => {
              console.error(err);
              reject(RESPONSE_STATUS.USER_UNKNOWN);
            });
        }
      }
    });
  }

  // TODO: 權限不足不能查詢別人的資料
  async get(id: string) {
    const staff = await this.mStaffRepo.findByID(id);
    return staff;
  }

  // TODO: 權限不足不能查詢別的單位的員工資料
  async list(departmentID: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!departmentID) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartment = await new DepartmentModel().findByID(departmentID);
        if (!findDepartment) {
          reject(RESPONSE_STATUS.DATA_CREATE_FAIL);
          return;
        } else {
          const staffList = await this.mStaffRepo.findStaffList(findDepartment);
          resolve(staffList);
        }
      }
    });
  }

  async del(id: string) {
    return await this.mStaffRepo.del(id);
  }

  update(id: string, name: string, professional: string, departmentID: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name || !professional || !departmentID) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findDepartment = await new DepartmentModel().findByID(departmentID);
        const findStaffByID = await this.mStaffRepo.findOne({ id });
        const findStaffByName = await this.mStaffRepo.findByNameWithoutMyself(name, id);

        if (!findStaffByID) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else if (!findDepartment) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else if (findStaffByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          findStaffByID.name = name;
          findStaffByID.professional = professional;
          findStaffByID.type = findDepartment;

          try {
            await this.mStaffRepo.save(findStaffByID);
            resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  //TODO: 增加交接次數統計

  // 產生編號
  async generaterID() {
    const ID = 'S';
    // 取得目前數量
    let count = await this.mStaffRepo.count();
    // 數量+1
    count++;
    // 補0
    const id = Formatter.paddingLeftZero(count + '', parseInt(process.env.STAFF_ID_LENGTH));

    return (ID + id);
  }
}