import { PorterTypeModel } from './Porter.model';
import { MissionInstrumentModel } from './Mission.model';
import { BuildingModel } from '../model/Building.model';
import { UserModel } from '../model/User.model';
import { SystemPermissionModel } from './System.model';
import { data as initData } from './data';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

export class Initialize {
  installDatabaseDefaultData() {
    return new Promise<void>(async (resolve, reject) => {
      this.instatllSystemPermission()
        .then(() => {
          return this.installSystemUser();
        }).then(() => {
          return this.installMissionInstrument();
        }).then(() => {
          return this.installBuilding();
        }).then(() => {
          return this.installPorterType();
        }).then(() => {
          resolve();
        });
    });
  }

  // 新增系統預設權限
  private instatllSystemPermission() {
    const systemPermissionModel = new SystemPermissionModel();

    return new Promise<void>(async (resolve, reject) => {
      initData.systemPermission.forEach(async (item: string[], index: number) => {
        await systemPermissionModel.create(
          parseInt(item[0]), item[1]).then(() => { }, () => { });

        if (index === initData.systemPermission.length - 1) {
          console.log('\n\t*** 安裝系統預設權限 ***');
          resolve();
        }
      });
    });
  }

  // 新增系統管理員
  private installSystemUser() {
    return new Promise<void>(async (resolve, reject) => {
      const userModel = new UserModel();
      
      initData.user.forEach(async (item: string[], index: number) => {
        await userModel.create(
          item[0], item[2], item[3], parseInt(item[1])).then(() => { }, () => { });

        if (index === initData.user.length - 1) {
          console.log('\n\t*** 安裝系統預設使用者 ***');
          resolve();
        }
      });
    });
  }

  // 新增任務傳送工具
  private installMissionInstrument() {
    const instrumentModel = new MissionInstrumentModel();

    return new Promise<void>(async (resolve, reject) => {
      initData.instrument.forEach(async (item: string[], index: number) => {
        await instrumentModel.create(item[0], item[1]).then(() => { }, () => { });

        if (index === initData.instrument.length - 1) {
          console.log('\n\t*** 安裝系統預設任務傳送工具 ***');
          resolve();
        }
      });
    });
  }

  // 新增建築物 
  private installBuilding() {
    const buildingModel = new BuildingModel();

    return new Promise<void>(async (resolve, reject) => {
      initData.building.forEach(async (item: string[], index: number) => {
        await buildingModel.create(item[0], item[1]).then(() => { }, () => { });

        if (index === initData.building.length - 1) {
          console.log('\n\t*** 安裝系統預設建築物 ***');
          resolve();
        }
      });
    });
  }

  // 新增傳送員類型
  private installPorterType() {
    const porterTypeModel = new PorterTypeModel();

    return new Promise<void>(async (resolve, reject) => {
      initData.porterType.forEach(async (item: string[], index: number) => {
        await porterTypeModel.create(item[0]).then(() => { }, () => { });

        if (index === initData.porterType.length - 1) {
          console.log('\n\t*** 安裝系統預設傳送員類型 ***');
          resolve();
        }
      });
    });
  }
}
