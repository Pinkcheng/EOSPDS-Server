import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { SystemPermission } from '../entity/SystemPermission.entity';
import { SystemParameter } from '../entity/SystemParameter.entity';

@EntityRepository(SystemParameter)
export class SystemParameterRepository extends Repository<SystemParameter> {
  findByParameter(parameter: string) {
    return this.findOne({ parameter });
  }
}

export class SystemParameterModel {
  private mSystemParameterRepo: SystemParameterRepository;

  constructor() {
    this.mSystemParameterRepo = getCustomRepository(SystemParameterRepository);
  }

  async create(parameter: string, value: string) {
    const newSystemParameter = new SystemParameter();
    newSystemParameter.parameter = parameter;
    newSystemParameter.value = value;

    // 如果有相同的參數名稱，就略過
    if (await this.mSystemParameterRepo.findByParameter(parameter)) {
      return;
    }

    try {
      await this.mSystemParameterRepo.save(newSystemParameter);
    } catch(err) {
      console.error(err);
    }
  }

  async get(parameter: string) {
    return this.mSystemParameterRepo.findOne({ parameter });
  }
}

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

  async find(id: number) {
    return this.mSystemPermissionRepo.findById(id);
  }
}