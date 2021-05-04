import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum SYSTEM_PERMISSION {
  'SYSTEM_ADMINISTRATOR' = 0,
  'PORTER_CENTER' = 1,
  'DEPARTMENT' = 2,
  'PORTER' = 3
}
@Entity('system_permission')
export class SystemPermission {
  // 權限等級
  @PrimaryColumn({
    type: 'int',
    unsigned: true,
    name: 'id'
  })
  id: SYSTEM_PERMISSION;

  // 權限名稱
  @Column('varchar', {
    length: 50,
    name: 'name'
  })
  name: string;
}