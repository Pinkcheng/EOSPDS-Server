import { Formatter } from './../core/Formatter';
import { UserModel } from './User.model';
import { PorterType } from '../entity/PorterType.entity';
import { Porter } from '../entity/Porter.entity';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

import dotenv from 'dotenv';
import { DepartmentModel } from './Department.model';
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

  getAll() {
    const porters = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .leftJoinAndSelect('porter.department', 'department')
      .orderBy('porter.id', 'ASC')
      .getMany();

    return porters;
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

  // 產生傳送員編號
  async generatePorterID(porterType: number) {
    const porterID = 'P' + porterType;
    // 取得目前傳送員的數量
    let count = await this.mPorterRepo.count();
    // 數量+1
    count++;
    // 補0
    const id = Formatter.paddingLeftZero(count + '', parseInt(process.env.PORTER_ID_LENGTH));

    return (porterID + id);
  }

  async create(
    name: string,
    account: string,
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
      } else if (!account) {
        reject(RESPONSE_STATUS.USER_ACCOUNT_IS_EMPTY);
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

      // 新增帳號
      const userModel = new UserModel();
      const newPorter = new Porter();
      const newPorterID = await this.generatePorterID(type);
      
      userModel.create(
        newPorterID, account, password, SYSTEM_PERMISSION.PORTER)
        .then(() => {
          // 新增帳號成功，新增傳送員
          newPorter.id = newPorterID;
          newPorter.name = name;
          newPorter.tagNumber = tagNumber;
          newPorter.type = findType;
          newPorter.birthday = birthday;
          newPorter.gender = gender;
          newPorter.department = findDepartment;

          return this.mPorterRepo.save(newPorter);
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
    });
  }

  async findByID(id: string) {
    const porter = await this.mPorterRepo.findByID(id);
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

  async allAll() {
    const porterList = await this.mPorterRepo.getAll();
    return porterList;
  }

  async del(id: string) {
    // 先刪除帳號
    const userModel = new UserModel();
    userModel.del(id);

    return await this.mPorterRepo.del(id);
  }
}