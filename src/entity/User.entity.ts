import { SystemPermission } from './SystemPermission.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('user_password')
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
    name: 'porter_account'
  })
  account: string;

  // 人員登入密碼
  @Column('varchar', {
    length: 70,
    name: 'porter_password'
  })
  password: string;

  // 人員系統權限
  @ManyToOne(
    () => SystemPermission,
    permission => permission.ID
  )
  permission: SystemPermission;
}
