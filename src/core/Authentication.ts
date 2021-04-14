import { PorterModel } from '../model/Porter.model';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

import { AUTH_RESPONSE_STATUS } from './ResponseCode';
import { SystemParameterModel } from '../model/SystemParameter.model';
import { UserModel } from '../model/User.model';

export class Authentication {
  
  /**
   * 登入系統，並取得token
   * @param account 登入帳號
   * @param password 登入密碼
   * @returns 登入成功，回傳access token，登入失敗，回傳錯誤碼
   */
  login(account: string, password: string) {
    return new Promise<any>(async (resolve, reject) => {
      // 檢查是否有空值
      if (!account) {
        reject(AUTH_RESPONSE_STATUS.WARNING_ACCOUNT_IS_EMPTY);
        return;
      } else if (!password) {
        reject(AUTH_RESPONSE_STATUS.WARNING_PASSWORD_IS_EMPTY);
        return;
      }

      const porterModel = new PorterModel();
      const systemParameterModel = new SystemParameterModel();
      const userModel = new UserModel();

      try {
        // TODO: 系統管理員登入帳號密碼，移動到system_password即可
        // 取得系統管理員登入帳號和密碼
        const systemAccount = await systemParameterModel.get('SYSTEM_ADMIN_ACCOUNT');
        const systemAccountPassword = await systemParameterModel.get('SYSTEM_ADMIN_ACCOUNT_PASSWORD');
        const checkSystemPassword = await userModel.comparePassword(password, systemAccountPassword.value);

        // 先判斷登入的帳號是否為，系統管理員的帳號
        if (systemAccount.value === account && checkSystemPassword) {
          resolve(userModel.generateAccessToken('9999', account, 0));
        } else { // 如不是則尋找，是否為請求單位，或是傳送員的帳號
          const porter = await porterModel.findByAccount(account);
          // 找不到該帳號傳送員
          if (!porter) {
            reject(AUTH_RESPONSE_STATUS.ERROR_LOGIN_FAIL);
            return;
          } else {
            // 比對使用者密碼
            const checkPassword = await userModel.comparePassword(password, porter.password);
            if (checkPassword) {
              // TODO: porter permission is undefind
              resolve(userModel.generateAccessToken(porter.ID, porter.name, porter.permission.ID));
            } else {
              // 密碼比對錯誤
              reject(AUTH_RESPONSE_STATUS.ERROR_LOGIN_FAIL);
            }
          }
        }
      } catch (err) {
        console.error(err);
        reject(AUTH_RESPONSE_STATUS.ERROR_UNKNOWN);
      };
    });
  }
}