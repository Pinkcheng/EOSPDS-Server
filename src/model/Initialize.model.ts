import { BuildingModel } from '../model/Building.model';
import { UserModel } from '../model/User.model';
import { SystemPermissionModel } from './System.model';
import { data } from './data';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

export class Initialize {
  static async installDatabaseDefaultData() {
    const needCount = 3;
    let finishCount = 0;

    return new Promise<void>(async (resolve, reject) => {
      // 新增系統預設權限
      const systemPermissionModel = new SystemPermissionModel();
      data.systemPermission.forEach(async (item: string[], index: number) => {
        await systemPermissionModel.create(
          parseInt(item[0]), item[1]).then(() => { }, () => { });

        if (index === data.systemPermission.length - 1) {
          finishCount++;
          console.log('\n\t*** 安裝系統預設權限 ***');

          if (finishCount === needCount) {
            resolve();
          }
        }
      });
      // 新增系統管理員
      const userModel = new UserModel();
      data.user.forEach(async (item: string[], index: number) => {
        const findSystemPermission = await systemPermissionModel.find(parseInt(item[1]));
        await userModel.create(
          item[0], item[2], item[3], findSystemPermission).then(() => { }, () => { });

        if (index === data.user.length - 1) {
          finishCount++;
          console.log('\n\t*** 安裝系統預設使用者 ***');

          if (finishCount === needCount) {
            resolve();
          }
        }
      });
      // 新增建築物
      const buildingModel = new BuildingModel();
      data.building.forEach(async (item: string[], index: number) => {
        buildingModel.create(item[0], item[1]).then(() => { }, () => { });

        if (index === data.building.length - 1) {
          finishCount++;
          console.log('\n\t*** 安裝系統預設建築物 ***');

          if (finishCount === needCount) {
            resolve();
          }
        }
      });
    });
  }
}
