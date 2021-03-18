import { PorterModel } from './../model/Porter.model';
import dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';
import { AUTH_RESPONSE_STATUS } from './ResponseCode';

// Read .env files settings
dotenv.config();

export class Authentication {

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
      // 檢查是否有帳號和密碼相同的傳送員
      const porterModel = new PorterModel();
      porterModel.findByAccountPassword(account, password)
        .then(porter => {
          if (porter) {
            resolve(sign({ 
                id: porter.ID,
                name: porter.name,
                permission: porter.permission 
              }, process.env.JWT_SECRET, { expiresIn: '1 day' })
            );
          } else {
            reject(AUTH_RESPONSE_STATUS.ERROR_LOGIN_FAIL);
          }
        });
    });
  }
}