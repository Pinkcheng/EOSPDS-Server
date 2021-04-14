import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('porter_type')
export class PorterType {
  // 傳送員編號
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id'
  })
  ID: number;
  
  // 傳送員類型名稱
  @Column('varchar', {
    length: 50,
    name: 'name'
  })
  name: string;
}