import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('porter_permission')
export class PorterPermission {
  // 權限等級
  @PrimaryColumn({
    type: 'int',
    unsigned: true,
    name: 'id'
  })
  ID: number;
  // 權限名稱
  @Column('varchar', {
    length: 50,
    name: 'name'
  })
  name: string;
}