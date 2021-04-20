import { SystemPermission } from './SystemPermission.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('user_list')
export class User {
  // 人員編號
  @PrimaryColumn('varchar', {
    length: 20,
    name: 'user_id'
  })
  ID: string;

  // 人員登入帳號
  @Index({ unique: true })
  @Column('varchar', {
    length: 50,
    name: 'account'
  })
  account: string;

  // 人員登入密碼
  @Column('varchar', {
    length: 70,
    name: 'password'
  })
  password: string;

  // 人員取得api token
  @Column('varchar', {
    length: 250,
    name: 'token',
    default: null
  })
  token: string;

  // 人員系統權限
  @ManyToOne(
    () => SystemPermission,
    permission => permission.ID
  )
  permission: SystemPermission;
}
