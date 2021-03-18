import { PorterModel } from '../model/Porter.model';
import dotenv from 'dotenv';
import { sign, verify } from 'jsonwebtoken';
import { AUTH_RESPONSE_STATUS } from './ResponseCode';
import { compare as passwordCompare } from 'bcrypt';
import { Porter } from '../entity/porter.entity';


// Read .env files settings
dotenv.config();

export class Authentication {
  private mPorter: Porter;
  /**
   * 登入系統，並取得token
   * @param account 登入帳號
   * @param password 登入密碼
   * @returns 登入成功，回傳access token，登入失敗，回傳錯誤碼
   */
  login(account: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      // 檢查是否有空值
      if (!account) {
        reject(AUTH_RESPONSE_STATUS.WARNING_ACCOUNT_IS_EMPTY);
        return;
      } else if (!password) {
        reject(AUTH_RESPONSE_STATUS.WARNING_PASSWORD_IS_EMPTY);
        return;
      }
      // 取得相同帳號的傳送員
      const porterModel = new PorterModel();
      porterModel.findByAccount(account)
        .then(porter => {
          // 找不到該帳號傳送員
          if (!porter) {
            reject(AUTH_RESPONSE_STATUS.ERROR_LOGIN_FAIL);
            return;
          } else {
            this.mPorter = porter;
            // 開始比對密碼
            return passwordCompare(password, porter.password);
          }
        }).then(result => {
          if (result) {
            // 密碼比對成功
            resolve(sign({
              id: this.mPorter.ID,
              name: this.mPorter.name,
              permission: this.mPorter.permission
            }, process.env.JWT_SECRET, { expiresIn: '1 day' })
            );
          } else {
            // 密碼比對錯誤
            reject(AUTH_RESPONSE_STATUS.ERROR_LOGIN_FAIL);
          }
        }).catch(err => {
          console.error(err);
          reject(AUTH_RESPONSE_STATUS.ERROR_UNKNOWN);
        });
    });
  }
}