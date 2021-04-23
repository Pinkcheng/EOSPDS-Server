import { MissionType } from './../entity/MissionType.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

@EntityRepository(MissionType)
export class MissionTypegRepository extends Repository<MissionType> {
  findByID(ID: number) {
    return this.findOne({ ID });
  }

  getAll() {
    const missionTypeList = this.createQueryBuilder('missionType')
      .getMany();

    return missionTypeList;
  }

  del(ID: number) {
    this.createQueryBuilder('missionType')
      .delete()
      .where({ ID })
      .execute();
  }
}

export class MissionTypeModel {
  private mMissionTypeRepo: MissionTypegRepository;

  constructor() {
    this.mMissionTypeRepo = getCustomRepository(MissionTypegRepository);
  }

  create(name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionType = await this.mMissionTypeRepo.findOne({ name });
        if (findMissionType) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newMissionTYPe = new MissionType();
          newMissionTYPe.name = name;
    
          try {
            await this.mMissionTypeRepo.save(newMissionTYPe);
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
    const buildingList = await this.mMissionTypeRepo.getAll();
    return buildingList;
  }

  async del(ID: number) {
    return await this.mMissionTypeRepo.del(ID);
  }

  update(ID: number, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!ID || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findMissionType = await this.mMissionTypeRepo.findOne({ ID });
        if (!findMissionType) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          findMissionType.name = name;
    
          try {
            await this.mMissionTypeRepo.save(findMissionType);
            resolve(RESPONSE_STATUS.DATA_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }

  async findByID(ID: number) {
    const department = await this.mMissionTypeRepo.findByID(ID);
    return department;
  }
}