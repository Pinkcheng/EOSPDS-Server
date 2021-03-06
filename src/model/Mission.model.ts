import { update } from './../controllers/Department.controller';
import { User } from './../entity/UserList.entity';
import { PorterModel } from './Porter.model';
import { Mission, MISSION_STATUS } from './../entity/Mission.entity';
import { MissionProcess, MISSION_PROCESS_STATUS } from './../entity/MissionProcess.entity';
import { MissionInstrument } from './../entity/MissionInstrument.entity';
import { MissionType } from '../entity/MissionType.entity';
import { MissionLabel } from './../entity/MissionLabel.entity';

import { Brackets, EntityRepository, getCustomRepository, Repository } from 'typeorm';
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
      .where(`process.mid = '${missionID}'`)
      .orderBy('process.id', 'ASC')
      .getMany();

    return missionProcess;
  }

  findMissionProcessByIDAndStatus(missionID: string, status: MISSION_PROCESS_STATUS) {
    const missionProcess = this.createQueryBuilder('process')
      .where(`process.mid = '${missionID}'`)
      .andWhere(`process.status = '${status}'`)
      .getOne();

    return missionProcess;
  }

  deleteMissionProcessByID(missionID: string) {
    this.createQueryBuilder('process')
      .delete()
      .where(`process.mid = ${missionID}`)
      .execute();
  }
}

export class MissionProcessModel {
  private mMissionProcessRepo: MissionProcessRepository;

  constructor() {
    this.mMissionProcessRepo = getCustomRepository(MissionProcessRepository);
  }
  // TODO: ???????????????????????????????????????????????????????????????????????????
  async insert(
    missoinID: string,
    status: MISSION_PROCESS_STATUS,
    departmentID: string,
    time?: string
  ) {
    const newMissionProcess = new MissionProcess();
    newMissionProcess.status = status;
    newMissionProcess.mid = missoinID;
    newMissionProcess.handover = departmentID;
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
    const processList = await this.mMissionProcessRepo.findMissionProcessByID(missionID);
    return {
      'add': { 'time': processList[0].time, 'handover': processList[0].handover },
      'start': { 'time': processList[1].time, 'handover': processList[1].handover },
      'in_process': { 'time': processList[2].time, 'handover': processList[2].handover },
      'finish': { 'time': processList[3].time, 'handover': processList[3].handover },
    };
  }

  async deleteMissionProcess(missionID: string) {
    await this.mMissionProcessRepo.deleteMissionProcessByID(missionID);
  }

  async updateMissionProcess(
    missionID: string,
    status: MISSION_STATUS,
    departmentID: string,
    time: string = date.format(new Date(), process.env.DATE_FORMAT)
  ) {
    return new Promise<any>(async (resolve, reject) => {
      // ??????????????????????????????????????????
      let missionProcessStatus: MISSION_PROCESS_STATUS;
      switch (status) {
        case MISSION_STATUS.NOT_DISPATCHED:
          missionProcessStatus = MISSION_PROCESS_STATUS.ADD;
          break;
        case MISSION_STATUS.NOT_STARTED:
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

      if (!findMissionProcess) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      } else {
        try {
          // ??????????????????
          findMissionProcess.time = time;
          findMissionProcess.handover = departmentID;
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
  findMissionListByDepartment(
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
      .orderBy('mission.createTime', 'DESC')
      .where(`mission.createTime >= '${days}'`);

    if (selectDepartment) {
      missions.andWhere(`(mission.startDepartment = '${selectDepartment}'
        or mission.endDepartment = '${selectDepartment}')`);
    }

    if (status) {
      missions.andWhere(`mission.status = '${status}'`);
    }

    const sql = missions.getSql();
    return missions.getMany();
  }

  findMissionListByPorter(
    days: string,
    selectPorter: string,
    status: MISSION_STATUS
  ): Promise<Mission[]> {
    const missions = this.createQueryBuilder('mission')
      .leftJoinAndSelect('mission.label', 'label')
      .leftJoinAndSelect('mission.instrument', 'instrument')
      .leftJoinAndSelect('mission.startDepartment', 'startDepartment')
      .leftJoinAndSelect('mission.endDepartment', 'endDepartment')
      .leftJoinAndSelect('mission.porter', 'porter')
      .where(`mission.porter = '${selectPorter}'`);

    if (days) {
      missions.andWhere(`mission.createTime >= '${days}'`);
    }

    if (status) {
      missions.andWhere(`mission.status = '${status}'`);
    }

    missions.orderBy('mission.createTime', 'DESC');
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
            // ??????????????????
            const missionProcessModel = new MissionProcessModel();

            await missionProcessModel.insert(newMission.id, MISSION_PROCESS_STATUS.ADD,
              startDepartmentID, date.format(new Date(), process.env.DATE_FORMAT));
            await missionProcessModel.insert(newMission.id, MISSION_PROCESS_STATUS.START, null);
            await missionProcessModel.insert(newMission.id, MISSION_PROCESS_STATUS.IN_PROGRESS, null);
            await missionProcessModel.insert(newMission.id, MISSION_PROCESS_STATUS.FINISH, null);

            resolve(RESPONSE_STATUS.DATA_CREATE_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  list(
    selectDataUser: User,
    selectDepartment?: string,
    days?: number,
    status: number = null
  ) {
    return new Promise<any>(async (resolve, reject) => {
      // ???????????????????????????????????????????????????
      if (!days) {
        days = parseInt(process.env.MISSION_SELECT_DAYS);
      }
      // ????????????????????????
      const selectDate = date.addDays(new Date(), -(days));

      // ========= ??????????????????????????? ===============
      // ???????????????????????????????????????
      const selectDataUserPermissionID = selectDataUser.permission.id;
      // ?????????????????????????????????
      let selectDataUserDepartmentID = null;
      let missionList: Mission[];

      // ????????????????????????
      if (selectDataUserPermissionID === SYSTEM_PERMISSION.DEPARTMENT) {
        const findDeaprtment = await new DepartmentModel().findByID(selectDataUser.id);
        selectDataUserDepartmentID = findDeaprtment.id;
        // ?????????????????????????????????????????????????????????
        if (selectDepartment) {
          // ??????????????????????????????????????????
          if (selectDataUserDepartmentID !== selectDepartment) {
            reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
            return;
          }
        } else {
          // ?????????????????????
          selectDepartment = selectDataUserDepartmentID;
        }

        missionList = await this.mMissionRepo.findMissionListByDepartment(
          date.format(selectDate, process.env.DATE_FORMAT), selectDepartment, status);
      } else if (selectDataUserPermissionID === SYSTEM_PERMISSION.PORTER) {
        missionList = await this.mMissionRepo.findMissionListByPorter(
          date.format(selectDate, process.env.DATE_FORMAT), selectDataUser.id, status);
      } else {
        missionList = await this.mMissionRepo.findMissionListByDepartment(
          date.format(selectDate, process.env.DATE_FORMAT), selectDepartment, status);
      }

      // ??????????????????0??????????????????
      if (missionList.length === 0) {
        resolve([]);
        return;
      } else {
        // ??????department??????
        for (let i = 0; i < missionList.length; i++) {
          const findStartDepartment = await new DepartmentModel().findByID(missionList[i].startDepartment.id);
          const findEndDepartment = await new DepartmentModel().findByID(missionList[i].endDepartment.id);
          const findLabel = await new MissionLabelModel().findByID(missionList[i].label.id);

          missionList[i].startDepartment = findStartDepartment;
          missionList[i].endDepartment = findEndDepartment;
          missionList[i].label = findLabel;
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
        // ========= ??????????????????????????? ===============
        // ???????????????????????????????????????
        const selectDataUserPermissionID = selectDataUser.permission.id;
        // ????????????????????????
        if (selectDataUserPermissionID === SYSTEM_PERMISSION.DEPARTMENT) {
          // ?????????????????????????????????
          const selectDataUserDepartmentID = await (await new DepartmentModel()
            .findByID(selectDataUser.id)).id;
          // ?????????????????????????????????
          if (findMission.startDepartment.id !== selectDataUserDepartmentID &&
              findMission.endDepartment.id !== selectDataUserDepartmentID) {
            reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
            return;
          }
        } else if (selectDataUserPermissionID === SYSTEM_PERMISSION.PORTER) {
          // ???????????????????????????
          // ???????????????????????????????????????????????????????????????
          if (!findMission.porter) {
            reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
            return;
          } else {
            // ??????????????????????????????????????????????????????
            if (findMission.porter.id !== selectDataUser.id) {
              reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
              return;
            }
          }
        }

        const processList = await new MissionProcessModel().getMissionProcess(findMission.id);
        // ??????handover??????
        let staffOrDepartment;
        if (processList.add.handover) {
          if (processList.add.handover.startsWith('D')) {
            staffOrDepartment = await new DepartmentModel().findByID(processList.add.handover);
          } else {
            staffOrDepartment = await new StaffModel().get(processList.add.handover);
          }
          processList.add.handover = staffOrDepartment;
        }

        if (processList.start.handover) {
          if (processList.start.handover.startsWith('D')) {
            staffOrDepartment = await new DepartmentModel().findByID(processList.start.handover);
          } else {
            staffOrDepartment = await new StaffModel().get(processList.start.handover);
          }
          processList.start.handover = staffOrDepartment;
        }

        if (processList.in_process.handover) {
          if (processList.in_process.handover.startsWith('D')) {
            staffOrDepartment = await new DepartmentModel().findByID(processList.in_process.handover);
          } else {
            staffOrDepartment = await new StaffModel().get(processList.in_process.handover);
          }
          processList.in_process.handover = staffOrDepartment;
        }

        if (processList.finish.handover) {
          if (processList.finish.handover.startsWith('D')) {
            staffOrDepartment = await new DepartmentModel().findByID(processList.finish.handover);
          } else {
            staffOrDepartment = await new StaffModel().get(processList.finish.handover);
          }
          processList.finish.handover = staffOrDepartment;
        }

        // ???????????????????????????????????????
        findMission.process = processList;

        // ??????department??????
        const findStartDepartment = await new DepartmentModel().findByID(findMission.startDepartment.id);
        const findEndDepartment = await new DepartmentModel().findByID(findMission.endDepartment.id);
        findMission.startDepartment = findStartDepartment;
        findMission.endDepartment = findEndDepartment;

        const findLabel = await new MissionLabelModel().findByID(findMission.label.id);
        findMission.label = findLabel;

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
        } else if (findMission.porter) {
          reject(RESPONSE_STATUS.MISSION_ALREADY_DISPATH);
          return;
        } else {
          try {
            // ????????????????????????
            findMission.porter = findPorter;
            findMission.status = MISSION_STATUS.NOT_STARTED;
            await this.mMissionRepo.save(findMission);

            // ???????????????????????????
            await new PorterModel().addPorterMissionCount(porterID);

            // ??????????????????
            await new MissionProcessModel().updateMissionProcess(missionID, MISSION_STATUS.NOT_STARTED, 'D1000001');
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
      if (!missionID || !handover) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      }

      const findMission = await this.mMissionRepo.findByID(missionID);
      if (!findMission) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      } else if (findMission.status === MISSION_STATUS.NOT_DISPATCHED) {
        reject(RESPONSE_STATUS.MISSION_NOT_DISPATCH);
        return;
      } else if (findMission.status === MISSION_STATUS.IN_PROGRESS) {
        reject(RESPONSE_STATUS.MISSION_ALREADY_STARTED);
        return;
      } else if (findMission.status === MISSION_STATUS.FINISH) {
        reject(RESPONSE_STATUS.MISSION_ALREADY_FINISH);
        return;
      }

      this.updateMissionStatus(selectDataUser, MISSION_STATUS.IN_PROGRESS, findMission, handover)
        .then(async code => {
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
      if (!missionID || !handover) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      }

      const findMission = await this.mMissionRepo.findByID(missionID);
      if (!findMission) {
        reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
        return;
      } else if (findMission.status === MISSION_STATUS.NOT_DISPATCHED) {
        reject(RESPONSE_STATUS.MISSION_NOT_DISPATCH);
        return;
      } else if (findMission.status === MISSION_STATUS.NOT_STARTED) {
        reject(RESPONSE_STATUS.MISSION_NOT_STARTED);
        return;
      } else if (findMission.status === MISSION_STATUS.FINISH) {
        reject(RESPONSE_STATUS.MISSION_ALREADY_FINISH);
        return;
      }

      this.updateMissionStatus(selectDataUser, MISSION_STATUS.FINISH, findMission, handover)
        .then(async code => {
          resolve(code);
        }, errCode => {
          reject(errCode);
        });
    });
  }

  // TODO: ????????????????????????
  // TODO: ????????????????????????????????????
  private updateMissionStatus(
    selectDataUser: User,
    action: MISSION_STATUS,
    mission: Mission,
    handover: string
  ) {
    return new Promise<any>(async (resolve, reject) => {
      if (!action || !mission || !handover) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const selectDataUserPermissinoID = selectDataUser.permission.id;
        // ?????????????????????????????????????????????????????????????????????????????????????????????????????????
        if (selectDataUserPermissinoID !== SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR
          && selectDataUserPermissinoID !== SYSTEM_PERMISSION.PORTER_CENTER
          && selectDataUserPermissinoID !== SYSTEM_PERMISSION.PORTER) {
          reject(RESPONSE_STATUS.AUTH_ACCESS_FAIL);
          return;
        }

        // ??????????????????????????????????????????????????????????????????
        if (!mission.porter) {
          reject(RESPONSE_STATUS.MISSION_NOT_DISPATCH);
          return;
        }

        // ????????????????????????????????????????????????????????????????????????
        if (selectDataUserPermissinoID === SYSTEM_PERMISSION.PORTER) {
          const findPorter = await new PorterModel().findByID(selectDataUser.id);
          if (mission.porter.id !== findPorter.id) {
            reject(RESPONSE_STATUS.AUTH_ACCESS_DATA_FAIL);
            return;
          }
        }

        let staffOrDepartment;
        if (handover.startsWith('D')) {
          staffOrDepartment = await new DepartmentModel().findByID(handover);
        } else {
          staffOrDepartment = await new StaffModel().get(handover);
        }

        if (!mission || !staffOrDepartment) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          if (action == MISSION_STATUS.NOT_DISPATCHED
            || action == MISSION_STATUS.NOT_STARTED) {
            reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
            return;
          } else {
            try {
              // ??????????????????
              mission.status = action;
              await this.mMissionRepo.save(mission);

              // ??????????????????
              await new MissionProcessModel()
                .updateMissionProcess(mission.id, action, staffOrDepartment.id);

              // ???????????????????????????
              if (action === MISSION_STATUS.FINISH) {
                await new PorterModel().subPorterMissionCount(mission.porter.id);
              }

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

  // TODO: ???????????????????????????
  delete(missionID: string) {
    return new Promise<any>(async (resolve, reject) => {
      const findMission = await this.mMissionRepo.findByID(missionID);
      await this.mMissionRepo.delete({id: missionID});
  
      // ?????????????????????????????????????????????????????????????????????
      if (findMission.status >= MISSION_STATUS.NOT_STARTED) {
        await new PorterModel().subPorterMissionCount(findMission.porter.id);
      }
      
      resolve(missionID);
    });
  }

  // TODO: ???????????????????????????
  async updateMission(
    missionID: string,
    contant: string,
    instrumnetID: string,
    startDepartmentID: string,
    endDepartmentID: string,
    missionLabelID: string
  ) {
    const findMission = await this.mMissionRepo.findByID(missionID);
    findMission.content = contant;
    findMission.instrument = await new MissionInstrumentModel().findByID(instrumnetID);
    findMission.startDepartment = await new DepartmentModel().findByID(startDepartmentID);
    findMission.endDepartment = await new DepartmentModel().findByID(endDepartmentID);
    findMission.label = await new MissionLabelModel().findByID(missionLabelID);

    await this.mMissionRepo.save(findMission);
  }
}