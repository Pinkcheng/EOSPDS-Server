import { BuildingModel } from '../model/Building.model';
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
    userModel.create('9999',
      process.env.ADMIN_ACCOUNT,
      process.env.ADMIN_ACCOUNT_PASSWORD,
      adminSystemPermission
    ).then(() => {
      console.log('新增系統管理員');
    }, () => {
      console.log('已經有系統管理員');
    });

    const buildingModel = new BuildingModel();
    buildingModel.create('B1100', '新醫療大樓一樓').then(() => {}, () => {});
    buildingModel.create('B1102', '新醫療大樓99樓').then(() => {}, () => {});
    buildingModel.create('B1103', '新醫療大樓88樓').then(() => {}, () => {});
  }
}
