import { MissionInstrument } from './../entity/MissionInstrument.entity';
import { MissionType } from '../entity/MissionType.entity';
import { MissionLabel } from './../entity/MissionLabel.entity';

import { Formatter } from './../core/Formatter';
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

  findByNameWithoutMyself(searchName: string, myselfID: string) {
    const list = this.createQueryBuilder('missionType')
      .where(`missionType.name = '${ searchName }'`)
      .andWhere(`missionType.id != '${ myselfID }'`)
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
      .where(`missionLabel.name = '${ searchName }'`)
      .andWhere(`missionLabel.id != '${ myselfID }'`)
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
      .where(`missionInstrument.name = '${ searchName }'`)
      .andWhere(`missionInstrument.id != '${ myselfID }'`)
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