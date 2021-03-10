import { PorterType } from './../entity/PorterType.entity';
import { Porter } from './../entity/porter.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import md5 from 'md5';

@EntityRepository(Porter)
export class PorterRepository extends Repository<Porter> {
}

export class PorterModel {
  private mPorterRepo: PorterRepository;

  constructor() {
    this.mPorterRepo = getCustomRepository(PorterRepository);
  }

  async createPorter(
    porterID: string,
    name: string,
    account: string,
    password: string,
    tagNumber: string,
    type: PorterType,
    birthday: string,
    gender: boolean
  ) {
    const newPorter = new Porter();
    newPorter.ID = porterID;
    newPorter.name = name;
    newPorter.account = account;
    newPorter.password = md5(password);
    newPorter.tagNumber = tagNumber ? tagNumber : null;
    newPorter.type = type ? type : null;
    newPorter.birthday = birthday;
    newPorter.gender = gender;

    const porter = await this.mPorterRepo.save(newPorter);
    return porter;
  }
}

@EntityRepository(PorterType)
export class PorterTypeRepository extends Repository<PorterType> {
  findByID(ID: number) {
    return this.findOne({ ID });
  }
}

export class PorterTypeModel {
  private mPorterTypeRepo: PorterTypeRepository;

  constructor() {
    this.mPorterTypeRepo = getCustomRepository(PorterTypeRepository);
  }

  async findByTypeID(id: number) {
    return await this.mPorterTypeRepo.findByID(id);
  }
}
