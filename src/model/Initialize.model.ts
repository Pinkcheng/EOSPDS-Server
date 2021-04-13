import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();
import { hashSync as passwordHashSync } from 'bcrypt';
const saltRounds = 10;

import { SystemParameterModel } from './SystemParameter.model';

export class Initialize {
  static async installDatabaseDefaultData() {
    // 註冊系統預設使用者
    const systemParameterModel = new SystemParameterModel(); 
    systemParameterModel.create('SYSTEM_ADMIN_ACCOUNT', process.env.ADMIN_ACCOUNT);
    systemParameterModel.create('SYSTEM_ADMIN_ACCOUNT_PASSWORD', 
      passwordHashSync(process.env.ADMIN_ACCOUNT_PASSWORD, saltRounds));
  }
}
