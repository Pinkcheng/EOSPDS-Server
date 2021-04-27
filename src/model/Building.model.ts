import { Building } from './../entity/Building.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RESPONSE_STATUS } from '../core/ResponseCode';

@EntityRepository(Building)
export class BuildingRepository extends Repository<Building> {
  getAll() {
    const buildingList = this.createQueryBuilder('building')
      .getMany();

    return buildingList;
  }

  del(id: string) {
    this.createQueryBuilder('building')
      .delete()
      .where({ id })
      .execute();
  }
}

export class BuildingModel {
  private mBuildingRepo: BuildingRepository;

  constructor() {
    this.mBuildingRepo = getCustomRepository(BuildingRepository);
  }

  create(id: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findBuilding = await this.mBuildingRepo.findOne({ id });
        if (findBuilding) {
          reject(RESPONSE_STATUS.DATA_REPEAT);
          return;
        } else {
          const newBuilding = new Building();
          newBuilding.id = id;
          newBuilding.name = name;
    
          try {
            await this.mBuildingRepo.save(newBuilding);
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
    const buildingList = await this.mBuildingRepo.getAll();
    return buildingList;
  }

  async del(id: string) {
    return await this.mBuildingRepo.del(id);
  }

  update(id: string, name: string) {
    return new Promise<any>(async (resolve, reject) => {
      if (!id || !name) {
        reject(RESPONSE_STATUS.DATA_REQUIRED_FIELD_IS_EMPTY);
        return;
      } else {
        const findBuilding = await this.mBuildingRepo.findOne({ id });
        if (!findBuilding) {
          reject(RESPONSE_STATUS.DATA_UPDATE_FAIL);
          return;
        } else {
          findBuilding.id = id;
          findBuilding.name = name;
    
          try {
            await this.mBuildingRepo.save(findBuilding);
            resolve(RESPONSE_STATUS.DATA_SUCCESS);
          } catch (err) {
            console.error(err);
            reject(RESPONSE_STATUS.DATA_UNKNOWN);
          }
        }
      }
    });
  }
}