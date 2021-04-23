import { PorterModel } from './Porter.model';
import { Porter } from './../entity/Porter.entity';
import { SystemPermission } from './../entity/SystemPermission.entity';
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

  del(ID: string) {
    this.createQueryBuilder('user')
      .delete()
      .where({ ID })
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
    permission: SystemPermission
  ) {
    return new Promise<any>(async (resolve, reject) => {
      // 確認輸入的帳號是否為空值
      if (!account) {
        reject(RESPONSE_STATUS.USER_ACCOUNT_IS_EMPTY);
        return;
        // 確認輸入的密碼是否為空值
      } else if (!password) {
        reject(RESPONSE_STATUS.USER_PASSWORD_IS_EMPTY);
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
      newUser.ID = id;
      newUser.account = account;
      newUser.password = passwordHashSync(password, saltRounds);
      newUser.permission = permission;

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
    const user = await this.mUserRepo.findOne({ ID });
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
        const passwordCheck = this.comparePassword(password, findUser.password);
        if (!passwordCheck) {
          reject(RESPONSE_STATUS.AUTH_LOGIN_FAIL);
          return;
        } else {
          let userName = '', permissionID = 9999, permissionName = '';
          switch (findUser.permission.ID) {
            case 0:
              userName = findUser.permission.name;
              permissionID = 0;
              permissionName = findUser.permission.name;
              break;
            case 2:
              const porterModel = new PorterModel();
              const porter = await porterModel.findByID(findUser.ID);
              userName = porter.name;
              permissionID = 1;
              permissionName = findUser.permission.name;
              break;
            default:
              reject(RESPONSE_STATUS.AUTH_UNKNOWN);
              return;
          }

          const accessToken = this.generateAccessToken(
            findUser.ID, userName, permissionID, permissionName);
          await this.updateToken(findUser.ID, accessToken);
          resolve(accessToken);
        }
      }
    });
  }

  async del(ID: string) {
    return await this.mUserRepo.del(ID);
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