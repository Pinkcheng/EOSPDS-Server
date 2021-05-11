import { User } from './../entity/UserList.entity';
import { PorterModel } from './Porter.model';
import { Mission, MISSION_STATUS } from './../entity/Mission.entity';
import { MissionProcess, MISSION_PROCESS_STATUS } from './../entity/MissionProcess.entity';
import { MissionInstrument } from './../entity/MissionInstrument.entity';
import { MissionType } from '../entity/MissionType.entity';
import { MissionLabel } from './../entity/MissionLabel.entity';

import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import date from 'date-and-time';
import { RESPONSE_STATUS } from '../core/ResponseCode';
import { DepartmentModel } from './Department.model';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
import { StaffModel } from './Staff.model';

@EntityRepository(MissionType)
export class MissionTypegRepository extends Repository<MissionType> {
  findByID(id: string) {
    return this.findOne({ id });
  }

  getAll() {
    const missionTypeList = this.createQueryBuilder('missionType')
      .orderBy('missionType.id', 'ASC')
      .getMany();

    return missionTypeList;
  }

  del(id: string) {
    this.createQueryBuilder('missionType')
      .delete()
      .where({ id })
      .execute();
  }

  findByNameWithoutMyself(searchName: string, myselfID: string) {
    const list = this.createQueryBuilder('missionType')
      .where(`missionType.name = '${searchName}'`)
      .andWhere(`missionType.id != '${myselfID}'`)
      .getOne();

    return list;
  }
}

export class MissionTypeModel {
  private mMissionTypeRepo: MissionTypegRepository;

  constructor() {
    this.mMissionTypeRepo = getCustomRepository(MissionTypegRepository);
  }

  create(name: string, transport: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!name || !transport) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionTypeByName = await this.mMissionTypeRepo.findOne({ name });

        if (findMissionTypeByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newMissionType = new MissionType();
          newMissionType.name = name;
          newMissionType.transport = transport;

          try {
            await this.mMissionTypeRepo.save(newMissionType);
            resolve(RESPONSE_STATUS.DATA_CREATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async getAll() {
    const typeList = await this.mMissionTypeRepo.getAll();
    return typeList;
  }

  async del(id: string) {
    return await this.mMissionTypeRepo.del(id);
  }

  update(id: string, name: string, transport: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name || !transport) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionTypeByID = await this.mMissionTypeRepo.findOne({ id });
        const findMissionTypeByName = await this.mMissionTypeRepo
          .findByNameWithoutMyself(name, id);

        if (!findMissionTypeByID) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else if (findMissionTypeByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          findMissionTypeByID.name = name;
          findMissionTypeByID.transport = transport;

          try {
            await this.mMissionTypeRepo.save(findMissionTypeByID);
            resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async findByID(id: string) {
    const type = await this.mMissionTypeRepo.findByID(id);
    return type;
  }
}

@EntityRepository(MissionLabel)
export class MissionLabelRepository extends Repository<MissionLabel> {
  findByID(id: string) {
    const label = this.createQueryBuilder('label')
      .leftJoinAndSelect('label.type', 'type')
      .where({ id })
      .getOne();

    return label;
  }

  getAll() {
    const labels = this.createQueryBuilder('label')
      .leftJoinAndSelect('label.type', 'type')
      .orderBy('label.id', 'ASC')
      .getMany();

    return labels;
  }

  getAllByMissionType(type: MissionType) {
    const labels = this.createQueryBuilder('label')
      .leftJoinAndSelect('label.type', 'type')
      .where({ type })
      .orderBy('label.id', 'ASC')
      .getMany();

    return labels;
  }

  del(id: string) {
    this.createQueryBuilder('label')
      .delete()
      .where({ id })
      .execute();
  }

  findByNameWithoutMyself(searchName: string, myselfID: string) {
    const list = this.createQueryBuilder('missionLabel')
      .where(`missionLabel.name = '${searchName}'`)
      .andWhere(`missionLabel.id != '${myselfID}'`)
      .getOne();

    return list;
  }
}

export class MissionLabelModel {
  private mMissionLabelRepo: MissionLabelRepository;

  constructor() {
    this.mMissionLabelRepo = getCustomRepository(MissionLabelRepository);
  }

  create(name: string, missionTypeID: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!name || !missionTypeID) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionType = await new MissionTypeModel().findByID(missionTypeID);
        const findMissionLabelByName = await this.mMissionLabelRepo.findOne({ name });

        if (findMissionLabelByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else if (!findMissionType) {
          reject(RESPONSE_STATUS.DATA_CREATE_FAIL);
          return;
        } else {
          const newMissionLabel = new MissionLabel();
          newMissionLabel.name = name;
          newMissionLabel.type = findMissionType;

          try {
            await this.mMissionLabelRepo.save(newMissionLabel);
            resolve(RESPONSE_STATUS.DATA_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async getAll(missionTypeID: string) {
    if (!missionTypeID) {
      const labelList = await this.mMissionLabelRepo.getAll();
      return labelList;
    } else {
      const findMissionType = await new MissionTypeModel().findByID(missionTypeID);
      const labelList = await this.mMissionLabelRepo.getAllByMissionType(findMissionType);
      return labelList;
    }
  }

  async del(id: string) {
    return await this.mMissionLabelRepo.del(id);
  }

  update(id: string, name: string, missionTypeID: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name || !missionTypeID) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionType = await new MissionTypeModel().findByID(missionTypeID);
        const findMissionLabelByID = await this.mMissionLabelRepo.findOne({ id });
        const findMissionLabelByName = await this.mMissionLabelRepo
          .findByNameWithoutMyself(name, id);

        if (!findMissionLabelByID) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else if (findMissionLabelByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else if (!findMissionType) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          findMissionLabelByID.name = name;
          findMissionLabelByID.type = findMissionType;

          try {
            await this.mMissionLabelRepo.save(findMissionLabelByID);
            resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async findByID(id: string) {
    const label = await this.mMissionLabelRepo.findByID(id);
    return label;
  }
}

@EntityRepository(MissionInstrument)
export class MissionInstrumentRepository extends Repository<MissionInstrument> {
  findByID(id: string) {
    return this.findOne({ id });
  }

  getAll() {
    const instrumentList = this.createQueryBuilder('instrument')
      .orderBy('instrument.id', 'ASC')
      .getMany();

    return instrumentList;
  }

  del(id: string) {
    this.createQueryBuilder('instrument')
      .delete()
      .where({ id })
      .execute();
  }

  findByNameWithoutMyself(searchName: string, myselfID: string) {
    const list = this.createQueryBuilder('instrument')
      .where(`instrument.name = '${searchName}'`)
      .andWhere(`instrument.id != '${myselfID}'`)
      .getOne();

    return list;
  }
}

export class MissionInstrumentModel {
  private mMisionInstrumentRepo: MissionInstrumentRepository;

  constructor() {
    this.mMisionInstrumentRepo = getCustomRepository(MissionInstrumentRepository);
  }

  create(id: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionInstrumentByName = await this.mMisionInstrumentRepo.findOne({ name });

        if (findMissionInstrumentByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newMissionInstrument = new MissionInstrument();
          newMissionInstrument.id = id;
          newMissionInstrument.name = name;

          try {
            await this.mMisionInstrumentRepo.save(newMissionInstrument);
            resolve(RESPONSE_STATUS.DATA_CREATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async getAll() {
    const instruments = await this.mMisionInstrumentRepo.getAll();
    return instruments;
  }

  async del(id: string) {
    return await this.mMisionInstrumentRepo.del(id);
  }

  update(id: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionInstrumentByID = await this.mMisionInstrumentRepo.findOne({ id });
        const findMissionInstrumentByName = await this.mMisionInstrumentRepo
          .findByNameWithoutMyself(name, id);

        if (!findMissionInstrumentByID) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else if (findMissionInstrumentByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          findMissionInstrumentByID.name = name;

          try {
            await this.mMisionInstrumentRepo.save(findMissionInstrumentByID);
            resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async findByID(id: string) {
    const instrument = await this.mMisionInstrumentRepo.findByID(id);
    return instrument;
  }
}
@EntityRepository(MissionProcess)
export class MissionProcessRepository extends Repository<MissionProcess> {
  findMissionProcessByID(missionID: string) {
    const missionProcess = this.createQueryBuilder('process')
      .leftJoinAndSelect('process.department', 'department')
      .where(`process.mid = '${missionID}'`)
      .orderBy('process.id', 'ASC')
      .getMany();

    return missionProcess;
  }

  findMissionProcessByIDAndStatus(missionID: string, status: MISSION_PROCESS_STATUS) {
    const missionProcess = this.createQueryBuilder('process')
      .leftJoinAndSelect('process.department', 'department')
      .where(`process.mid = '${missionID}'`)
      .andWhere(`process.status = '${status}'`)
      .getOne();

    return missionProcess;
  }

}

export class MissionProcessModel {
  private mMissionProcessRepo: MissionProcessRepository;

  constructor() {
    this.mMissionProcessRepo = getCustomRepository(MissionProcessRepository);
  }
  // TODO: 加入交接人員，還有更新任務狀態，要可以更新交接人員
  async insert(
    missoinID: string,
    status: MISSION_PROCESS_STATUS,
    departmentID: string,
    time?: string
  ) {
    const newMissionProcess = new MissionProcess();
    newMissionProcess.status = status;
    newMissionProcess.mid = missoinID;
    newMissionProcess.department = await new DepartmentModel().findByID(departmentID);
    if (time) {
      newMissionProcess.time = time;
    }

    try {
      await this.mMissionProcessRepo.save(newMissionProcess);
    } catch (err) {
      console.error(err);
    }
  }

  async getMissionProcess(missionID: string) {
    return await this.mMissionProcessRepo.findMissionProcessByID(missionID);
  }

  async updateMissionProcess(
    missionID: string,
    status: MISSION_STATUS,
    departmentID: string,
    time: string = date.format(new Date(), process.env.DATE_FORMAT)
  ) {
    return new Promise<any>(async (resolve, reject) => {
      // 轉換任務狀態，為任務進度狀態
      let missionProcessStatus: MISSION_PROCESS_STATUS;
      switch (status) {
        case MISSION_STATUS.NOT_DISPATCHED:
          missionProcessStatus = MISSION_PROCESS_STATUS.ADD;
          break;
        case MISSION_STATUS.NOT_STATED:
          missionProcessStatus = MISSION_PROCESS_STATUS.START;
          break;
        case MISSION_STATUS.IN_PROGRESS:
          missionProcessStatus = MISSION_PROCESS_STATUS.IN_PROGRESS;
          break;
        case MISSION_STATUS.FINISH:
          missionProcessStatus = MISSION_PROCESS_STATUS.FINISH;
          break;
        default:
          reject(RESPONSE_STATUS.DATA_UNKNOWN);
          return;
      }

      const findMissionProcess = await this.mMissionProcessRepo
        .findMissionProcessByIDAndStatus(missionID, missionProcessStatus);
      const findDepartment = await new DepartmentModel().findByID(departmentID);

      if (!findMissionProcess || !findDepartment) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      } else {
        try {
          // 更新任務狀態
          findMissionProcess.time = time;
          findMissionProcess.department = findDepartment;
          await this.mMissionProcessRepo.save(findMissionProcess);
          resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
        } catch (err) {
          console.error(err);
          reject(RESPONSE_STATUS.DATA_UNKNOWN);
        }
      }
    });
  }
}

@EntityRepository(Mission)
export class MissionRepository extends Repository<Mission> {
  findMissionList(
    days: string,
    selectDepartment: string,
    status: MISSION_STATUS
  ): Promise<Mission[]> {
    const missions = this.createQueryBuilder('mission')
      .leftJoinAndSelect('mission.label', 'label')
      .leftJoinAndSelect('mission.instrument', 'instrument')
      .leftJoinAndSelect('mission.startDepartment', 'startDepartment')
      .leftJoinAndSelect('mission.endDepartment', 'endDepartment')
      .leftJoinAndSelect('mission.porter', 'porter')
      .orderBy('mission.id', 'ASC');

    if (days && !selectDepartment) {
      missions.where(`mission.createTime >= '${days}'`);
    } else if (!days && selectDepartment) {
      missions.where({ startDepartment: selectDepartment });
    } else if (days && selectDepartment) {
      missions.where({ startDepartment: selectDepartment });
      missions.andWhere(`mission.createTime >= '${days}'`);
    }

    if (status) {
      missions.andWhere(`mission.status = '${status}'`);
    }

    return missions.getMany();
  }

  findByID(id: string) {
    const mission = this.createQueryBuilder('mission')
      .leftJoinAndSelect('mission.label', 'label')
      .leftJoinAndSelect('mission.instrument', 'instrument')
      .leftJoinAndSelect('mission.startDepartment', 'startDepartment')
      .leftJoinAndSelect('mission.endDepartment', 'endDepartment')
      .leftJoinAndSelect('mission.porter', 'porter')
      .where({ id })
      .getOne();

    return mission;
  }
}

export class MissionModel {
  private mMissionRepo: MissionRepository;

  constructor() {
    this.mMissionRepo = getCustomRepository(MissionRepository);
  }

  create(
    labelID: string,
    startDepartmentID: string,
    endDepartmentID: string,
    instrumentID: string = 'I0000',
    content?: string,
  ) {
    return new Promise<any>(async (resolve, reject) => {
      if (!labelID) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionLabel = await new MissionLabelModel().findByID(labelID);
        const findStartDepartment = await new DepartmentModel().findByID(startDepartmentID);
        const findEndDepartment = await new DepartmentModel().findByID(endDepartmentID);
        const findMissionInstrument = await new MissionInstrumentModel().findByID(instrumentID);

        if (instrumentID) {
          if (!findMissionInstrument) {
            reject(RESPONSE_STATUS.DATA_CREATE_FAIL);
            return;
          }
        }

        if (!findMissionLabel || !findStartDepartment || !findEndDepartment) {
          reject(RESPONSE_STATUS.DATA_CREATE_FAIL);
          return;
        } else {
          try {

            const newMission = new Mission(
              findMissionLabel.type.transport, findMissionLabel.type.id, findMissionLabel.id,
              date.format(new Date(), 'YYYYMMDD'));
            newMission.content = content;
            newMission.label = findMissionLabel;
            newMission.instrument = findMissionInstrument;
            newMission.startDepartment = findStartDepartment;
            newMission.endDepartment = findEndDepartment;
            await this.mMissionRepo.save(newMission);
            // 新增任務進度
            const missionProcessModel = new MissionProcessModel();

            await missionProcessModel.insert(newMission.id, MISSION_PROCESS_STATUS.ADD,
              startDepartmentID, date.format(new Date(), process.env.DATE_FORMAT));
            await missionProcessModel.insert(newMission.id, MISSION_PROCESS_STATUS.START, null);
            await missionProcessModel.insert(newMission.id, MISSION_PROCESS_STATUS.IN_PROGRESS, null);
            await missionProcessModel.insert(newMission.id, MISSION_PROCESS_STATUS.FINISH, endDepartmentID);

            resolve(RESPONSE_STATUS.DATA_CREATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  // TODO: 自己的單位才能查自己的，系統管理員可以查全部的
  list(
    selectDataUser: User,
    selectDepartment?: string,
    days?: number,
    status: number = null
  ) {
    return new Promise<any>(async (resolve, reject) => {
      // 若沒有指定查詢天數，則使用預設天數
      if (!days) {
        days = parseInt(process.env.MISSION_SELECT_DAYS);
      }
      // 進行查詢天數計算
      const selectDate = date.addDays(new Date(), -(days));

      // ========= 確認資料存取的權限 ===============
      // 取得查詢使用者的使用者權限
      const selectDataUserPermissionID = selectDataUser.permission.id;
      // 取得查詢使用者單位編號
      let selectDataUserDepartmentID = null;
      // 使用者權限為單位
      if (selectDataUserPermissionID === SYSTEM_PERMISSION.DEPARTMENT) {
        const findStaff = await new StaffModel().get(selectDataUser.id);
        selectDataUserDepartmentID = findStaff.department.id;
        // 如果使用者權限為單位，又有指定查詢資料
        if (selectDepartment) {
          // 查詢非自己單位的資料，則拒絕
          if (selectDataUserDepartmentID !== selectDepartment) {
            reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
            return;
          }
        } else {
          // 查詢自己的單位
          selectDepartment = selectDataUserDepartmentID;
        }
      }

      const missionList = await this.mMissionRepo.findMissionList(
        date.format(selectDate, process.env.DATE_FORMAT), selectDepartment, status);
      // 若任務數量為0，回傳空陣列
      if (missionList.length === 0) {
        resolve([]);
        return;
      } else {
        // 替換department物件
        for (let i = 0; i < missionList.length; i++) {
          const findStartDepartment = await new DepartmentModel().findByID(missionList[i].startDepartment.id);
          const findEndDepartment = await new DepartmentModel().findByID(missionList[i].endDepartment.id);

          missionList[i].startDepartment = findStartDepartment;
          missionList[i].endDepartment = findEndDepartment;
        }
      }

      resolve(missionList);
    });
  }

  get(
    selectDataUser: User,
    missionID: string
  ) {
    return new Promise<any>(async (resolve, reject) => {
      const findMission = await this.mMissionRepo.findByID(missionID);
      if (!findMission) {
        reject(RESPONSE_STATUS.DATA_UNKNOWN);
        return;
      } else {
        // ========= 確認資料存取的權限 ===============
        // 取得查詢使用者的使用者權限
        const selectDataUserPermissionID = selectDataUser.permission.id;
        // 使用者權限為單位
        if (selectDataUserPermissionID === SYSTEM_PERMISSION.DEPARTMENT) {
          // 取得查詢使用者單位編號
          const selectDataUserDepartmentID = await (await new StaffModel()
            .get(selectDataUser.id)).department.id;
          // 查詢不是自己單位的任務
          if (findMission.startDepartment.id !== selectDataUserDepartmentID) {
            reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
            return;
          }
        } else if (selectDataUserPermissionID === SYSTEM_PERMISSION.PORTER) {
          // 如果查詢者為傳送員
          // 該任務尚未指派傳送員，則沒有訪問任務的權限
          if (!findMission.porter) {
            reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
            return;
          } else {
            // 如果傳送員查詢不是自己的任務，則拒絕
            if (findMission.porter.id !== selectDataUser.id) {
              reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
              return;
            }
          }
        }

        const processList = await new MissionProcessModel().getMissionProcess(findMission.id);
        // 刪除不要的物件參數
        processList.forEach(process => {
          delete process.id;
          delete process.mid;
        });
        // 將任務陣列丟到新的任務陣列
        findMission.process = processList;
        // 替換department物件
        const findStartDepartment = await new DepartmentModel().findByID(findMission.startDepartment.id);
        const findEndDepartment = await new DepartmentModel().findByID(findMission.endDepartment.id);
        findMission.startDepartment = findStartDepartment;
        findMission.endDepartment = findEndDepartment;
        
        resolve(findMission);
      }
    });
  }

  manualDispatch(missionID: string, porterID: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!missionID || !porterID) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMission = await this.mMissionRepo.findByID(missionID);
        const findPorter = await new PorterModel().findByID(porterID);

        if (!findMission || !findPorter) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          try {
            // 指派任務給傳送員
            findMission.porter = findPorter;
            findMission.status = MISSION_STATUS.NOT_STATED;
            await this.mMissionRepo.save(findMission);
            // 更新任務進度
            await new MissionProcessModel().updateMissionProcess(missionID, MISSION_STATUS.NOT_STATED, findMission.startDepartment.id);
            resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  autoDispathc() {

  }

  start(
    selectDataUser: User,
    missionID: string,
    handover: string
  ) {
    return new Promise<any>(async (resolve, reject) => {
      this.updateMissionStatus(selectDataUser, MISSION_STATUS.IN_PROGRESS, missionID, handover)
        .then(code => {
          resolve(code);
        }, errCode => {
          reject(errCode);
        });
    });
  }

  finish(
    selectDataUser: User,
    missionID: string,
    handover: string
  ) {
    return new Promise<any>(async (resolve, reject) => {
      this.updateMissionStatus(selectDataUser, MISSION_STATUS.FINISH, missionID, handover)
        .then(code => {
          resolve(code);
        }, errCode => {
          reject(errCode);
        });
    });
  }

  // TODO: 員工交接次數次算
  // TODO: 任務交接單位或是單位人員
  private updateMissionStatus(
    selectDataUser: User,
    action: MISSION_STATUS,
    missionID: string,
    handover: string
  ) {
    return new Promise<any>(async (resolve, reject) => {
      if (!action || !missionID || !handover) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const selectDataUserPermissinoID = selectDataUser.permission.id;
        // 如果使用者權限非系統管理員、傳送中心或是傳送員，則不能進行任務狀態更新
        if (selectDataUserPermissinoID !== SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR
          && selectDataUserPermissinoID !== SYSTEM_PERMISSION.PORTER_CENTER
          && selectDataUserPermissinoID !== SYSTEM_PERMISSION.PORTER) {
          reject(RESPONSE_STATUS.AUTH_ACCESS_FAIL);
          return;
        }

        const findMission = await this.mMissionRepo.findByID(missionID);
        // 任務尚未指派給任何人員，無法進行任務狀態更新
        if (!findMission.porter) {
          reject(RESPONSE_STATUS.MISSION_NOT_DISPATCH);
          return;
        }

        // 如果使用者權限為傳送員，則不能更新不是自己的任務
        if (selectDataUserPermissinoID === SYSTEM_PERMISSION.PORTER) {
          const findPorter = await new PorterModel().findByID(selectDataUser.id);
          if (findMission.porter.id !== findPorter.id) {
            reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
            return;
          }
        }

        let staffOrDepartment;
        if (handover.startsWith('D')) {
          staffOrDepartment = await new DepartmentModel().findByID(handover);
        } else {
          staffOrDepartment = await new PorterModel().findByID(handover);
        }

        if (!findMission || !staffOrDepartment) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          if (action == MISSION_STATUS.NOT_DISPATCHED
            || action == MISSION_STATUS.NOT_STATED) {
            reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
            return;
          } else {
            try {
              // 更新任務狀態
              findMission.status = action;
              await this.mMissionRepo.save(findMission);
              // 更新任務進度
              await new MissionProcessModel()
                .updateMissionProcess(missionID, action, findMission.startDepartment.id);
              resolve(RESPONSE_STATUS.DATA_UPDATE_SUCCESS);
            } catch (err) {
              console.error(err);
              reject(RESPONSE_STATUS.DATA_UNKNOWN);
            }
          }
        }
      }
    });
  }
}