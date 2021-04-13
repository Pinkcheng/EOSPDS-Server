import { PorterModel } from '../model/Porter.model';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

import { sign } from 'jsonwebtoken';
import { AUTH_RESPONSE_STATUS } from './ResponseCode';
import { compare as passwordCompare } from 'bcrypt';
import { Porter } from '../entity/porter.entity';
import { SystemParameterModel } from '../model/SystemParameter.model';

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

      const porterModel = new PorterModel();
      porterModel.findByAccount(account).then(porter => {
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

  alogin(account: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      // 檢查是否有空值
      if (!account) {
        reject(AUTH_RESPONSE_STATUS.WARNING_ACCOUNT_IS_EMPTY);
        return;
      } else if (!password) {
        reject(AUTH_RESPONSE_STATUS.WARNING_PASSWORD_IS_EMPTY);
        return;
      }

      const systemParameterModel = new SystemParameterModel();
      let isSystemAdminLogin = false;
      // 先取得系統管理員登入帳號
      systemParameterModel.get('SYSTEM_ADMIN_ACCOUNT')
        .then(systemAdminAccount => {
          // 比對使用者輸入的帳號是否為系統帳號
          if (systemAdminAccount.value === account) {
            // 標記為系統管理員帳號登入
            isSystemAdminLogin = true;
            return systemParameterModel.get('SYSTEM_ADMIN_ACCOUNT_PASSWORD');
          } else {
            return;
          }
          // 比對系統管理員密碼
        }).then(systemAdminPassword => {
          return passwordCompare(password, systemAdminPassword.value);
        }).then(result => {
          if (isSystemAdminLogin && result) {
            // 密碼比對成功
            // TODO:給token應該要集中
            resolve(sign({
              id: 0,
              name: account,
              permission: 0
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