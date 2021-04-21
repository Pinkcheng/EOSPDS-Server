import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
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