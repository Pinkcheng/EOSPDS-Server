import { UserModel } from '../model/User.model';
import { SystemPermissionModel } from './SystemPermission.model';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

export class Initialize {
  static async installDatabaseDefaultData() {
    // 新增系統預設權限
    const systemPermissionModel = new SystemPermissionModel();
    await systemPermissionModel.create(0, '系統管理員');
    await systemPermissionModel.create(1, '請求單位');
    await systemPermissionModel.create(2, '傳送員');

    // // 新增系統管理員
    const adminSystemPermission = await systemPermissionModel.find(0);
    const userModel = new UserModel();
    userModel.creatUser('9999',
      process.env.ADMIN_ACCOUNT,
      process.env.ADMIN_ACCOUNT_PASSWORD,
      adminSystemPermission
    ).then(() => {
      console.log('新增系統管理員');
    }, () => {
      console.log('已經有系統管理員');
    });
  }
}
