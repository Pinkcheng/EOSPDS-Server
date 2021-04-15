import { SystemPermission } from './../entity/SystemPermission.entity';
import { User } from '../entity/User.entity';
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
    return this.findOne({ account });
  }
}

export class UserModel {
  private mUserRepo: UserRepository;

  constructor() {
    this.mUserRepo = getCustomRepository(UserRepository);
  }

  creatUser(
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

  generateAccessToken(
    id: string,
    name: string,
    permission: number,
    expires: string = process.env.ACCESS_TOKEN_DEFAULT_TIMEOUT
  ) {
    return sign({
      id: id,
      name: name,
      permission: permission
    }, process.env.JWT_SECRET,
      { expiresIn: expires });
  }

  comparePassword(input: string, encrypted: string) {
    return comparePassword(input, encrypted);
  }
}