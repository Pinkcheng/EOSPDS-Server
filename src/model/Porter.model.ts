import { PorterPermission } from './../entity/PorterPermission.entity';
import { PorterType } from './../entity/PorterType.entity';
import { Porter } from './../entity/porter.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { ADD_PORTER_RESPONSE_STATUS as RESPONSE_STATUS } from '../library/ResponseCode';
import md5 from 'md5';

@EntityRepository(PorterPermission)
export class PorterPermissionRepository extends Repository<PorterPermission> {
  findByID(ID: number) {
    return this.findOne({ ID });
  }
}

export class PorterPermissionModel {
  private mPorterPermissionRepo: PorterPermissionRepository;

  constructor() {
    this.mPorterPermissionRepo = getCustomRepository(PorterPermissionRepository);
  }

  async findByTypeID(id: number) {
    return await this.mPorterPermissionRepo.findByID(id);
  }
}

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
    return this.findOne({ ID });
  }

  findByName(name: string) {
    return this.findOne({ name });
  }

  findByAccount(account: string) {
    return this.findOne({ account });
  }

  findByTagNumber(tagNumber: string) {
    return this.findOne({ tagNumber });
  }
}

export class PorterModel {
  private mPorterRepo: PorterRepository;

  constructor() {
    this.mPorterRepo = getCustomRepository(PorterRepository);
  }

  async createPorter(
    id: string,
    name: string,
    account: string,
    password: string,
    tagNumber: string,
    type: number,
    permission: number,
    birthday: string,
    gender: boolean,
    success: any,
    fail: any
  ) {
    // 確認表單欄位是否有空值
    if (!name) {
      fail(RESPONSE_STATUS.WARNING_NAME_IS_EMPTY);
      return;
    } else if (!account) {
      fail(RESPONSE_STATUS.WARNING_ACCOUNT_IS_EMPTY);
      return;
    } else if (!password) {
      fail(RESPONSE_STATUS.WARNING_PASSWORD_IS_EMPTY);
      return;
    } else if (!type) {
      fail(RESPONSE_STATUS.WARNING_TYPE_IS_EMPTY);
      return;
    } else if (!id) {
      fail(RESPONSE_STATUS.WARNING_ID_IS_EMPTY);
      return;
    } else if (!permission && permission != 0) {
      fail(RESPONSE_STATUS.WARNING_PERMISSION_IS_EMPTY);
      return;
    }
    // 帳號全部轉換成小寫
    account = account.toLocaleLowerCase();
    const count = await this.count();
    // 有資料才需要比對，是否有重複的資料欄位
    if (count > 0) {
      // 確認是否有重複的傳送員編號
      if (await this.findByID(id)) {
        fail(RESPONSE_STATUS.ERROR_REPEAT_ID);
        return;
      }
      // 確認是否有重複的傳送員姓名
      if (await this.findByName(name)) {
        fail(RESPONSE_STATUS.ERROR_REPEAT_NAME);
        return;
      }
      // 確認是否有重複的傳送員帳號
      if (await this.findByAccount(account)) {
        fail(RESPONSE_STATUS.ERROR_REPEAT_ACCOUNT);
        return;
      }
      // 確認是否有重複的傳送員標籤編號
      if (await this.findByTagNumber(tagNumber)) {
        fail(RESPONSE_STATUS.ERROR_REPEAT_TAG_NUMBER);
        return;
      }
    }
    // 是否有該傳送員型態
    const findType = await new PorterTypeModel().findByTypeID(type);
    if (!findType) {
      fail(RESPONSE_STATUS.ERROR_TYPE_NOT_FOUND);
      return;
    }
    // 是否有傳送員權限的類型
    const findPermission = await new PorterPermissionModel().findByTypeID(permission);
    if (!findPermission) {
      fail(RESPONSE_STATUS.ERROR_PERMISSION_NOT_FOUND);
      return;
    }

    const newPorter = new Porter();
    newPorter.ID = id;
    newPorter.name = name;
    newPorter.account = account;
    newPorter.password = md5(password);
    newPorter.tagNumber = tagNumber ? tagNumber : null;
    newPorter.type = findType;
    newPorter.birthday = birthday;
    newPorter.gender = gender;
    newPorter.permission = findPermission;

    try {
      await this.mPorterRepo.save(newPorter);
      success();
    } catch (err) {
      console.error(err);
      fail(RESPONSE_STATUS.ERROR_NUKNOWN);
    }
  }

  async findByID(ID: string) {
    const porter = await this.mPorterRepo.findByID(ID);
    return porter;
  }

  async findByName(name: string) {
    const porter = await this.mPorterRepo.findByName(name);
    return porter;
  }

  async findByAccount(account: string) {
    const porter = await this.mPorterRepo.findByAccount(account);
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
}