import { Mission } from './../entity/Mission.entity';
import { MissionProcess } from './../entity/MissionProcess.entity';
import { MissionInstrument } from './../entity/MissionInstrument.entity';
import { MissionType } from '../entity/MissionType.entity';
import { MissionLabel } from './../entity/MissionLabel.entity';

import { Formatter } from './../core/Formatter';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import date from 'date-and-time';
import { RESPONSE_STATUS } from '../core/ResponseCode';
import { DepartmentModel } from './Department.model';

@EntityRepository(MissionType)
export class MissionTypegRepository extends Repository<MissionType> {
  findByID(id: string) {
    return this.findOne({ id });
  }

  getAll() {
    const missionTypeList = this.createQueryBuilder('missionType')
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
          newMissionType.id = await this.generaterID();
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

  // 產生編號
  async generaterID() {
    const ID = 'T';
    // 取得目前數量
    let count = await this.mMissionTypeRepo.count();
    // 數量+1
    count++;
    // 補0
    const id = Formatter.paddingLeftZero(count + '', parseInt(process.env.MISSION_TYPE_ID_LENGTH));

    return (ID + id);
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
      .getMany();

    return labels;
  }

  getAllByMissionType(type: MissionType) {
    const labels = this.createQueryBuilder('label')
      .leftJoinAndSelect('label.type', 'type')
      .where({ type })
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
          newMissionLabel.id = await this.generaterID();
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

  // 產生編號
  async generaterID() {
    const ID = 'L';
    // 取得目前數量
    let count = await this.mMissionLabelRepo.count();
    // 數量+1
    count++;
    // 補0
    const id = Formatter.paddingLeftZero(count + '', parseInt(process.env.MISSION_LABEL_ID_LENGTH));

    return (ID + id);
  }
}

@EntityRepository(MissionInstrument)
export class MissionInstrumentRepository extends Repository<MissionInstrument> {
  findByID(id: string) {
    return this.findOne({ id });
  }

  getAll() {
    const instrumentList = this.createQueryBuilder('missionInstrument')
      .getMany();

    return instrumentList;
  }

  del(id: string) {
    this.createQueryBuilder('missionInstrument')
      .delete()
      .where({ id })
      .execute();
  }

  findByNameWithoutMyself(searchName: string, myselfID: string) {
    const list = this.createQueryBuilder('missionInstrument')
      .where(`missionInstrument.name = '${searchName}'`)
      .andWhere(`missionInstrument.id != '${myselfID}'`)
      .getOne();

    return list;
  }
}

export class MissionInstrumentModel {
  private mMisionInstrumentRepo: MissionInstrumentRepository;

  constructor() {
    this.mMisionInstrumentRepo = getCustomRepository(MissionInstrumentRepository);
  }

  create(name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionInstrumentByName = await this.mMisionInstrumentRepo.findOne({ name });

        if (findMissionInstrumentByName) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newMissionInstrument = new MissionInstrument();
          newMissionInstrument.id = await this.generaterID();
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

  // 產生編號
  async generaterID() {
    const ID = 'I';
    // 取得目前數量
    let count = await this.mMisionInstrumentRepo.count();
    // 數量+1
    count++;
    // 補0
    const id = Formatter.paddingLeftZero(count + '', parseInt(process.env.MISSION_INSTRUMENT_ID_LENGTH));

    return (ID + id);
  }
}

export enum MISSION_STATUS {
  'ADD' = 'add',
  'START' = 'start',
  'IN_PROGRESS' = 'in_progress',
  'FINISH' = 'finish'
}

@EntityRepository(MissionProcess)
export class MissionProcessRepository extends Repository<MissionProcess> {
  findByMissionID(missionID: string) {
    const missionProcess = this.createQueryBuilder('missionProcess')
      .leftJoinAndSelect('missionProcess.department', 'department')
      .where(`missionProcess.mid = '${missionID}'`)
      .getMany();

    return missionProcess;
  }
}

export class MissionProcessModel {
  private mMissionProcessRepo: MissionProcessRepository;

  constructor() {
    this.mMissionProcessRepo = getCustomRepository(MissionProcessRepository);
  }
  // TODO: 加入交接人員，還有更新任務狀態，要可以更新交接人員
  async insert(missoinID: string, status: MISSION_STATUS, departmentID: string, time?: string) {
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
    return await this.mMissionProcessRepo.findByMissionID(missionID);
  }
}

@EntityRepository(Mission)
export class MissionRepository extends Repository<Mission> {
  findMissionList(days: string, department: string): Promise<Mission[]> {
    const missions = this.createQueryBuilder('mission')
      .leftJoinAndSelect('mission.label', 'label')
      .leftJoinAndSelect('mission.instrument', 'instrument')
      .leftJoinAndSelect('mission.startDepartment', 'startDepartment')
      .leftJoinAndSelect('mission.endDepartment', 'endDepartment');

    if (days && !department) {
      missions.where(`mission.createTime >= '${days}'`);
    } else if (!days && department) {
      missions.where({ startDepartment: department });
    } else if (days && department) {
      missions.where({ startDepartment: department });
      missions.andWhere(`mission.createTime >= '${days}'`);
    }

    return missions.getMany();;
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
    content?: string,
    instrumentID?: string
  ) {
    return new Promise<any>(async (resolve, reject) => {
      if (!labelID) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionLabel = await new MissionLabelModel().findByID(labelID);
        const findStartDepartment = await new DepartmentModel().findByID(startDepartmentID);
        const findEndDepartment = await new DepartmentModel().findByID(endDepartmentID);
        const findMissionInstrument = instrumentID ? await new MissionInstrumentModel().findByID(instrumentID) : null;

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
            const newMisionID = await this.generaterID(findMissionLabel.type.id, findMissionLabel.id, date.format(new Date(), 'YYYYMMDD'));

            const newMission = new Mission();
            newMission.id = newMisionID;
            newMission.content = content;
            newMission.label = findMissionLabel;
            newMission.instrument = findMissionInstrument;
            newMission.startDepartment = findStartDepartment;
            newMission.endDepartment = findEndDepartment;
            await this.mMissionRepo.save(newMission);
            // 新增任務進度
            const missionProcessModel = new MissionProcessModel();

            await missionProcessModel.insert(newMisionID, MISSION_STATUS.ADD,
              startDepartmentID, date.format(new Date(), process.env.DATE_FORMAT));
            await missionProcessModel.insert(newMisionID, MISSION_STATUS.START, null);
            await missionProcessModel.insert(newMisionID, MISSION_STATUS.IN_PROGRESS, null);
            await missionProcessModel.insert(newMisionID, MISSION_STATUS.FINISH, endDepartmentID);

            resolve(RESPONSE_STATUS.DATA_CREATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  list(days?: number, department?: string) {
    return new Promise<any>(async (resolve, reject) => {
      // 若沒有指定查詢天數，則使用預設天數
      if (!days) {
        days = parseInt(process.env.MISSION_SELECT_DAYS);
      }
      // 進行查詢天數計算
      const selectDate = date.addDays(new Date(), -(days));
      const missionList = await this.mMissionRepo.findMissionList(
        date.format(selectDate, process.env.DATE_FORMAT), department);
      // 若任務數量為0，回傳空陣列
      if (missionList.length === 0) {
        resolve([]);
        return;
      }
      // 取得單個任務的所有任務狀態
      missionList.forEach(async (mission, index) => {
        // 取得該任務，所有任務狀態加入
        const processList = await new MissionProcessModel().getMissionProcess(mission.id);
        // 刪除不要的物件參數
        processList.forEach(process => {
          delete process.id;
          delete process.mid;
        });
        // 將任務陣列丟到新的任務陣列
        mission.process = processList;
        // 組合完畢回傳陣列
        if (index === missionList.length - 1) {
          resolve(missionList);
        }
      });
    });
  }

  async generaterID(missionType: string, missionLabel: string, date: string) {
    const type = parseInt(missionType.split('T')[1]);
    const label = parseInt(missionLabel.split('L')[1]);

    missionLabel = Formatter.paddingLeftZero(label + '',
      parseInt(process.env.MISSION_LABEL_ID_LENGTH));

    const ID = `M${type}${missionLabel}${date}`;

    // 取得目前數量
    let count = await this.mMissionRepo.count();
    // 數量+1
    count++;
    // 補0
    const id = Formatter.paddingLeftZero(count + '', parseInt(process.env.MISSION_ID_LENGTH));

    return (ID + id);
  }
}