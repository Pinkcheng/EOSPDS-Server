import { SystemParameterModel, SystemPermissionModel } from './System.model';
import { StaffModel } from './Staff.model';
import { PorterModel } from './Porter.model';
import { SystemPermission, SYSTEM_PERMISSION } from './../entity/SystemPermission.entity';
import { User } from '../entity/UserList.entity';
import { sign } from 'jsonwebtoken';
import { compare as comparePassword } from 'bcrypt';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';
import { hashSync as passwordHashSync } from 'bcrypt';
const saltRounds = 10;

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByAccount(account: string) {
    const user = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.permission', 'permission')
      .where('user.account = :account', { account: account })
      .getOne();

    return user;
  }

  findByToken(token: string) {
    const user = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.permission', 'permission')
      .where('user.token = :token', { token: token })
      .getOne();

    return user;
  }

  del(id: string) {
    this.createQueryBuilder('user')
      .delete()
      .where({ id })
      .execute();
  }
}

export class UserModel {
  private mUserRepo: UserRepository;

  constructor() {
    this.mUserRepo = getCustomRepository(UserRepository);
  }

  create(
    id: string,
    account: string,
    password: string,
    permissionID: SYSTEM_PERMISSION
  ) {
    return new Promise<any>(async (resolve, reject) => {
      const findPermission = await new SystemPermissionModel().find(permissionID);

      // 確認輸入的帳號是否為空值
      if (!account) {
        reject(RESPONSE_STATUS.USER_ACCOUNT_IS_EMPTY);
        return;
        // 確認輸入的密碼是否為空值
      } else if (!password) {
        reject(RESPONSE_STATUS.USER_PASSWORD_IS_EMPTY);
        return;
      } else if (!findPermission) {
        reject(RESPONSE_STATUS.USER_UNKNOWN);
        return;
      }

      // 帳號全部轉換成小寫
      account = account.toLocaleLowerCase();

      // 檢查是否有重複的帳號名稱
      // 有資料才需要比對，是否有重複的資料欄位
      const count = await this.mUserRepo.count();
      if (count > 0) {
        // 發現有重複的帳號名稱
        if (await this.mUserRepo.findByAccount(account)) {
          reject(RESPONSE_STATUS.USER_REPEAT_ACCOUNT);
          return;
        }
      }

      const newUser = new User();
      newUser.id = id;
      newUser.account = account;
      newUser.password = passwordHashSync(password, saltRounds);
      newUser.permission = findPermission;

      try {
        await this.mUserRepo.save(newUser);
        resolve(RESPONSE_STATUS.USER_SUCCESS);
      } catch (err) {
        console.error(err);
        reject(RESPONSE_STATUS.USER_UNKNOWN);
      }
    });
  }

  async findByToken(token: string) {
    token = token.split('.')[2];
    const user = await this.mUserRepo.findByToken(token);
    return user;
  }

  async updateToken(ID: string, token: string) {
    // 分割token，取第三個，才存入資料庫
    token = token.split('.')[2];
    const user = await this.mUserRepo.findOne({ id: ID });
    user.token = token;
    await this.mUserRepo.save(user);
  }

  login(account: string, password: string) {
    return new Promise<any>(async (resolve, reject) => {
      const findUser = await this.mUserRepo.findByAccount(account);
      if (!findUser) {
        reject(RESPONSE_STATUS.AUTH_LOGIN_FAIL);
        return;
      } else {
        const passwordCheck = await this.comparePassword(password, findUser.password);
        if (!passwordCheck) {
          reject(RESPONSE_STATUS.AUTH_LOGIN_FAIL);
          return;
        } else {
          let userName = '', permissionID = 9999, permissionName = '';
          switch (findUser.permission.id) {
            case SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR:
              userName = findUser.permission.name;
              permissionID = SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR;
              permissionName = findUser.permission.name;
              break;
            case SYSTEM_PERMISSION.DEPARTMENT:
              const staffModel = new StaffModel();
              const findStaff = await staffModel.get(findUser.id);
              userName = findStaff.name;
              permissionID = SYSTEM_PERMISSION.DEPARTMENT;
              permissionName = findUser.permission.name;
              break;
            case SYSTEM_PERMISSION.PORTER:
              const porterModel = new PorterModel();
              const porter = await porterModel.findByID(findUser.id);
              userName = porter.name;
              permissionID = SYSTEM_PERMISSION.PORTER;
              permissionName = findUser.permission.name;
              break;
            default:
              reject(RESPONSE_STATUS.AUTH_UNKNOWN);
              return;
          }

          const accessToken = this.generateAccessToken(
            findUser.id, userName, permissionID, permissionName);
          await this.updateToken(findUser.id, accessToken);
          resolve(accessToken);
        }
      }
    });
  }

  async del(id: string) {
    return await this.mUserRepo.del(id);
  }

  generateAccessToken(
    id: string,
    name: string,
    permissionID: number,
    permissionName: string,
    expires: string = process.env.ACCESS_TOKEN_DEFAULT_TIMEOUT
  ) {
    return sign({
      id: id,
      name: name,
      permission: permissionID,
      permissionName: permissionName
    }, process.env.JWT_SECRET,
      { expiresIn: expires });
  }

  comparePassword(input: string, encrypted: string) {
    return comparePassword(input, encrypted);
  }
}