import { DepartmentModel } from './Department.model';
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
          return this.installDepartment();
        }).then(() => {
          resolve();
        });
    });
  }

  // 新增系統預設權限
  private instatllSystemPermission() {
    const systemPermissionModel = new SystemPermissionModel();

    return new Promise<void>(async (resolve, reject) => {
      for (let i = 0; i < initData.systemPermission.length; i++) {
        const data = initData.systemPermission[i];
        await systemPermissionModel.create(
          parseInt(data[0] + ''), data[1] + '').then(() => { }, () => { });

        if (i === initData.systemPermission.length - 1) {
          console.log('\n\t*** 安裝系統預設權限 ***');
          resolve();
        }
      }
    });
  }

  // 新增系統管理員
  private installSystemUser() {
    return new Promise<void>(async (resolve, reject) => {
      const userModel = new UserModel();

      for (let i = 0; i < initData.user.length; i++) {
        const data = initData.user[i];
        await userModel.create(
          data[0], data[2], data[3], parseInt(data[1])).then(() => { }, () => { });

        if (i === initData.user.length - 1) {
          console.log('\n\t*** 安裝系統預設使用者 ***');
          resolve();
        }
      }
    });
  }

  // 新增任務傳送工具
  private installMissionInstrument() {
    const instrumentModel = new MissionInstrumentModel();

    return new Promise<void>(async (resolve, reject) => {
      for (let i = 0; i < initData.instrument.length; i++) {
        const data = initData.instrument[i];
        await instrumentModel.create(data[0], data[2]).then(() => { }, () => { });

        if (i === initData.instrument.length - 1) {
          console.log('\n\t*** 安裝系統預設任務工具 ***');
          resolve();
        }
      }
    });
  }

  // 新增建築物 
  private installBuilding() {
    const buildingModel = new BuildingModel();

    return new Promise<void>(async (resolve, reject) => {
      for (let i = 0; i < initData.building.length; i++) {
        const data = initData.building[i];
        await buildingModel.create(data[0], data[2]).then(() => { }, () => { });

        if (i === initData.building.length - 1) {
          console.log('\n\t*** 安裝系統預設建築物 ***');
          resolve();
        }
      }
    });
  }

  // 新增傳送員類型
  private installPorterType() {
    const porterTypeModel = new PorterTypeModel();

    return new Promise<void>(async (resolve, reject) => {
      for (let i = 0; i < initData.porterType.length; i++) {
        const data = initData.porterType[i];
        await porterTypeModel.create(data[0]).then(() => { }, () => { });

        if (i === initData.porterType.length - 1) {
          console.log('\n\t*** 安裝系統預設傳送員類型 ***');
          resolve();
        }
      }
    });
  }

  // 新增單位
  private installDepartment() {
    const departmentModel = new DepartmentModel();

    return new Promise<void>(async (resolve, reject) => {
      for (let i = 0; i < initData.department.length; i++) {
        const data = initData.department[i];
        await departmentModel.create(data[0], data[1], data[2]).then(() => { }, () => { });

        if (i === initData.department.length - 1) {
          console.log('\n\t*** 安裝系統預設單位 ***');
          resolve();
        }
      }
    });
  }
}
