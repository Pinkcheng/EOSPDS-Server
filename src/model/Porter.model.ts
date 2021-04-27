import { Formatter } from './../core/Formatter';
import { SystemPermissionModel } from './System.model';
import { UserModel } from './User.model';
import { PorterType } from '../entity/PorterType.entity';
import { Porter } from '../entity/porter.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

@EntityRepository(PorterType)
export class PorterTypeRepository extends Repository<PorterType> {
  findByID(ID: number) {
    return this.findOne({ ID });
  }
}

export class PorterTypeModel {
  private mPorterTypeRepo: PorterTypeRepository;

  constructor() {
    this.mPorterTypeRepo = getCustomRepository(PorterTypeRepository);
  }

  async findByTypeID(id: number) {
    return await this.mPorterTypeRepo.findByID(id);
  }
}

@EntityRepository(Porter)
export class PorterRepository extends Repository<Porter> {
  findByID(ID: string) {
    const porter = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .where({ ID })
      .getOne();

    return porter;
  }

  findByName(name: string) {
    const porter = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .where({ name })
      .getOne();

    return porter;
  }

  findByTagNumber(tagNumber: string) {
    const porter = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .where({ tagNumber })
      .getOne();

    return porter;
  }

  getAll() {
    const porter = this.createQueryBuilder('porter')
      .leftJoinAndSelect('porter.type', 'type')
      .getMany();

    return porter;
  }

  del(ID: string) {
    this.createQueryBuilder('porter')
      .delete()
      .where({ ID })
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

  async createPorter(
    name: string,
    account: string,
    password: string,
    type: number,
    tagNumber: string = null,
    birthday: string = null,
    gender: boolean = null,
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

      // 新增帳號
      const userModel = new UserModel();
      const newPorter = new Porter();
      const newPorterID = await this.generatePorterID(type);

      userModel.create(
        newPorterID, account, password, await new SystemPermissionModel().find(2))
        .then(() => {
          // 新增帳號成功，新增傳送員
          newPorter.ID = newPorterID;
          newPorter.name = name;
          newPorter.tagNumber = tagNumber;
          newPorter.type = findType;
          newPorter.birthday = birthday;
          newPorter.gender = gender;

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

  async findByID(ID: string) {
    const porter = await this.mPorterRepo.findByID(ID);
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

  async del(ID: string) {
    // 先刪除帳號
    const userModel = new UserModel();
    userModel.del(ID);

    return await this.mPorterRepo.del(ID);
  }
}