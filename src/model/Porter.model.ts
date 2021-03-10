import { PorterType } from './../entity/PorterType.entity';
import { Porter } from './../entity/porter.entity';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import md5 from 'md5';

@EntityRepository(Porter)
export class PorterRepository extends Repository<Porter> {
  findByID(ID: string) {
    return this.findOne({ ID });
  }

  findByName(name: string){
    return this.findOne({ name });
  }

  findByAccount(account: string) {
    return this.findOne({ account });
  }

  findByTagNumber(tagNumber: string) {
    return this.findOne({ tagNumber });
  }
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

  async findByID(ID: string) {
    const porter = await this.mPorterRepo.findByID(ID);
    return porter;
  }

  async findByName(name: string) {
    const porter = await this.mPorterRepo.findByName(name);
    return porter;
  }

  async findByAccount(account: string) {
    const porter = await this.mPorterRepo.findByAccount(account);
    return porter;
  }

  async findByTagNumber(tagNumber: string) {
    const porter = await this.mPorterRepo.findByTagNumber(tagNumber);
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

  async count() {
    const porter = await this.mPorterRepo
      .createQueryBuilder('porter')
      .getCount();
    return porter;
  }
}
