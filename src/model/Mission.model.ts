import { MissionLabel } from './../entity/MissionLabel.entity';
import { Formatter } from './../core/Formatter';
import { MissionType } from '../entity/MissionType.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

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
            resolve(RESPONSE_STATUS.DATA_SUCCESS);
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
        const findMissionTypeByName = await this.mMissionTypeRepo.findOne({ name });

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

@EntityRepository(MissionType)
export class MissionLabelRepository extends Repository<MissionLabel> {
  findByID(id: string) {
    return this.findOne({ id });
  }

  getAll() {
    const missionLabelList = this.createQueryBuilder('missionLabel')
      .getMany();

    return missionLabelList;
  }

  del(id: string) {
    this.createQueryBuilder('missionLabel')
      .delete()
      .where({ id })
      .execute();
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

  async getAll() {
    const labelList = await this.mMissionLabelRepo.getAll();
    return labelList;
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
        const findMissionLabelByName = await this.mMissionLabelRepo.findOne({ name });

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
    const ID = 'T';
    // 取得目前數量
    let count = await this.mMissionLabelRepo.count();
    // 數量+1
    count++;
    // 補0
    const id = Formatter.paddingLeftZero(count + '', parseInt(process.env.MISSION_LABEL_ID_LENGTH));

    return (ID + id);
  }
}