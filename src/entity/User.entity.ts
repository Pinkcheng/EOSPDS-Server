import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('user_password')
export class User {
  // 人員編號
  @PrimaryColumn('varchar', {
    length: 20,
    name: 'pid'
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
}
