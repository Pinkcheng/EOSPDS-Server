import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { PorterType } from './PorterType.entity';

@Entity('porter_list')
export class Porter {
  // 傳送員編號
  @PrimaryColumn('varchar', {
    length: 10,
    name: 'pid'
  })
  id: string;

  // 傳送員姓名
  @Index({ unique: true })
  @Column('varchar', {
    length: 30,
    name: 'porter_name',
  })
  name: string;

  // 傳送員tag標籤編號
  @Index({ unique: true })
  @Column('varchar', {
    length: 25,
    name: 'tag_number',
    default: null
  })
  tagNumber: string;

  // 傳送員生日日期
  @Column('date', {
    name: 'porter_birthday',
    default: null
  })
  birthday: string;

  // 傳送員性別
  @Column('boolean', {
    name: 'porter_gender',
    default: null
  })
  gender: boolean;

  // 傳送員類型編號
  @ManyToOne(
    () => PorterType,
    type => type.id
  )
  type: PorterType;
}