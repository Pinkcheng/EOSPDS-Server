import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { SystemPermission } from '../entity/SystemPermission.entity';

@EntityRepository(SystemPermission)
export class SystemPermissionRepository extends Repository<SystemPermission> {
  findById(ID: number) {
    return this.findOne({ ID });
  }
}

export class SystemPermissionModel {
  private mSystemPermissionRepo: SystemPermissionRepository;

  constructor() {
    this.mSystemPermissionRepo = getCustomRepository(SystemPermissionRepository);
  }

  async create(id: number, name: string) {
    const newSystemPermission = new SystemPermission();
    newSystemPermission.ID = id;
    newSystemPermission.name = name;

    // 如果有相同的權限編號，就略過
    if (await this.mSystemPermissionRepo.findById(id)) {
      return;
    }

    try {
      await this.mSystemPermissionRepo.save(newSystemPermission);
    } catch(err) {
      console.error(err);
    }
  }
}