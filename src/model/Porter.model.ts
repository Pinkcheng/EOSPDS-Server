import { MissionModel } from './Mission.model';
import { PORTER_STATUS } from './../entity/Porter.entity';
import { UserModel } from './User.model';
import { PorterType } from '../entity/PorterType.entity';
import { Porter } from '../entity/Porter.entity';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

import dotenv from 'dotenv';
import { DepartmentModel } from './Department.model';
import { PorterPunchLog } from '../entity/PorterPunchLog.entity';
// Read .env files settings
dotenv.config();

@EntityRepository(PorterType)
export class PorterTypeRepository extends Repository<PorterType> {
  findByID(id: number) {
    return this.findOne({ id });
  }
}

export class PorterTypeModel {
  private mPorterTypeRepo: PorterTypeRepository;

  constructor() {
    this.mPorterTypeRepo = getCustomRepository(PorterTypeRepository);
  }

  async create(name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findPorterTypeByName = await this.mPorterTypeRepo.findOne({ name });

        if (findPorterTypeByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newPorterType = new PorterType();
          newPorterType.name = name;

          try {
            await this.mPorterTypeRepo.save(newPorterType);
            resolve(RESPONSE_STATUS.DATA_CREATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async findByTypeID(id: number) {
    return await this.mPorterTypeRepo.findByID(id);
  }
}

@EntityRepository(PorterPunchLog)
export class PorterPunchLogRepository extends Repository<PorterPunchLog> {
  findByID(id: number) {
    return this.findOne({ id });
  }
}

export class PorterPunchLogModel {
  private mPorterPunchLogRepo: PorterPunchLogRepository;

  constructor() {
    this.mPorterPunchLogRepo = getCustomRepository(PorterPunchLogRepository);
  }

  create(porterID: string, status: PORTER_STATUS) {
    return new Promise<any>(async (resolve, reject) => {
      if (!porterID || !status) {
        reject(RESPONSE_STATUS.DATA_CREATE_FAIL);
        return;
      }

      const porterLog = new PorterPunchLog();
      porterLog.porter = porterID;
      porterLog.status = status;

      try {
        await this.mPorterPunchLogRepo.save(porterLog);
        resolve(RESPONSE_STATUS.DATA_CREATE_SUCCESS);
      } catch (err) {
        console.log(err);
        reject(RESPONSE_STATUS.DATA_UNKNOWN);
      }
    });
  }

  list(porterID: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!porterID) {
        reject(RESPONSE_STATUS.DATA_SUCCESS);
        return;
      }

      const logs = await this.mPorterPunchLogRepo.find({ porter: porterID });
      resolve(logs);
    });
  }
}

@EntityRepository(Porter)
export class PorterRepository extends Repository<Porter> {
  findByID(id: string) {
    const porter = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .leftJoinAndSelect('porter.department', 'department')
      .where({ id })
      .getOne();

    return porter;
  }

  findByName(name: string) {
    const porter = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .leftJoinAndSelect('porter.department', 'department')
      .where({ name })
      .getOne();

    return porter;
  }

  findByTagNumber(tagNumber: string) {
    const porter = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .leftJoinAndSelect('porter.department', 'department')
      .where({ tagNumber })
      .getOne();

    return porter;
  }

  getAll(status: PORTER_STATUS) {
    const porters = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .leftJoinAndSelect('porter.department', 'department')
      .orderBy('porter.id', 'ASC');

    if (status) {
      porters.where(`porter.status = '${status}'`);
    }
    return porters.getMany();
  }

  del(id: string) {
    this.createQueryBuilder('porter')
      .delete()
      .where({ id })
      .execute();
  }
}

export class PorterModel {
  private mPorterRepo: PorterRepository;

  constructor() {
    this.mPorterRepo = getCustomRepository(PorterRepository);
  }

  async create(
    name: string,
    mobile: string,
    password: string,
    type: number,
    tagNumber: string = null,
    birthday: string = null,
    gender: number = null,
    departmentID: string = 'D1000001',
  ) {
    return new Promise<RESPONSE_STATUS>(async (resolve, reject) => {
      // 確認表單中必要的欄位，是否有空值
      if (!name) {
        reject(RESPONSE_STATUS.USER_NAME_IS_EMPTY);
        return;
      } else if (!mobile) {
        reject(RESPONSE_STATUS.USER_MOBILE_IS_EMPTY);
        return;
      } else if (!password) {
        reject(RESPONSE_STATUS.USER_PASSWORD_IS_EMPTY);
        return;
      } else if (!type) {
        reject(RESPONSE_STATUS.USER_PORTER_TYPE_IS_EMPTY);
        return;
      }

      // 確認是否有重複的傳送員姓名
      if (await this.mPorterRepo.findByName(name)) {
        reject(RESPONSE_STATUS.USER_REPEAT_NAME);
        return;
      }
      // 確認是否有重複的傳送員標籤編號
      if (await this.mPorterRepo.findByTagNumber(tagNumber)) {
        reject(RESPONSE_STATUS.USER_REPEAT_PORTER_TAG_NUMBER);
        return;
      }
      // 是否有該傳送員型態
      const findType = await new PorterTypeModel().findByTypeID(type);
      if (!findType) {
        reject(RESPONSE_STATUS.USER_PORTER_TYPE_NOT_FOUND);
        return;
      }
      // 是否有該單位
      const findDepartment = await new DepartmentModel().findByID(departmentID);
      if (!findDepartment) {
        reject(RESPONSE_STATUS.USER_UNKNOWN);
        return;
      }
      // 是否有重複帳號
      const findUser = await new UserModel().findByAccount(mobile);
      if (findUser) {
        reject(RESPONSE_STATUS.USER_REPEAT_ACCOUNT);
        return;
      }

      const newPorter = new Porter(type + '');
      // 新增傳送員
      newPorter.name = name;
      newPorter.tagNumber = tagNumber;
      newPorter.type = findType;
      newPorter.birthday = birthday;
      newPorter.gender = gender;
      newPorter.department = findDepartment;
      newPorter.mobile = mobile;
      await this.mPorterRepo.save(newPorter);

      // 新增帳號
      const userModel = new UserModel();
      userModel.create(
        newPorter.id, mobile, password, SYSTEM_PERMISSION.PORTER
      ).then(() => {
        resolve(RESPONSE_STATUS.USER_SUCCESS);
      }).catch(err => {
        console.error(err);
        reject(RESPONSE_STATUS.USER_UNKNOWN);
      });
    });
  }

  async findByID(id: string) {
    const porter = await this.mPorterRepo.findByID(id);
    // 替換department物件
    const findDepartment = await new DepartmentModel().findByID(porter.department.id);
    porter.department = findDepartment;
    return porter;
  }

  async findByName(name: string) {
    const porter = await this.mPorterRepo.findByName(name);
    return porter;
  }

  async findByTagNumber(tagNumber: string) {
    const porter = await this.mPorterRepo.findByTagNumber(tagNumber);
    return porter;
  }

  async count() {
    const porter = await this.mPorterRepo
      .createQueryBuilder('porter')
      .getCount();
    return porter;
  }

  async getAll(status?: PORTER_STATUS) {
    const porterList = await this.mPorterRepo.getAll(status);
    for (let i = 0; i < porterList.length; i++) {
      // 替換department物件
      const findDepartment = await new DepartmentModel().findByID(porterList[i].department.id);
      porterList[i].department = findDepartment;
    }

    return porterList;
  }

  async startWork(porterID: string) {
    return this.update(porterID, PORTER_STATUS.START_TO_WORK);
  }

  async finishWork(porterID: string) {
    return this.update(porterID, PORTER_STATUS.FINISH_WORK);
  }

  async update(porterID: string, status: PORTER_STATUS) {
    return new Promise<any>(async (resolve, reject) => {
      if (!porterID || !status) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      } else {
        const findPorter = await this.mPorterRepo.findByID(porterID);
        if (!findPorter) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        }

        try {
          findPorter.status = status;
          await this.mPorterRepo.save(findPorter);
          // 新增打卡紀錄
          await new PorterPunchLogModel().create(porterID, status);

          resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
        } catch (err) {
          console.error(err);
          reject(RESPONSE_STATUS.DATA_UNKNOWN);
        }
      }
    });
  }

  async addPorterMissionCount(porterID: string) {
    return new Promise<RESPONSE_STATUS>(async (resolve, reject) => {
      if (!porterID) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      } else {
        const findPorter = await this.mPorterRepo.findByID(porterID);
        if (!findPorter) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          findPorter.mission++;
          await this.mPorterRepo.save(findPorter);
          resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
        }
      }
    });
  }

  async subPorterMissionCount(porterID: string) {
    return new Promise<RESPONSE_STATUS>(async (resolve, reject) => {
      if (!porterID) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      } else {
        const findPorter = await this.mPorterRepo.findByID(porterID);
        if (!findPorter) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          findPorter.mission--;
          await this.mPorterRepo.save(findPorter);
          resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
        }
      }
    });
  }

  async del(id: string) {
    // 先刪除帳號
    const userModel = new UserModel();
    userModel.del(id);

    return await this.mPorterRepo.del(id);
  }
}