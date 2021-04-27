import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_parameter')
export class SystemParameter {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
    unsigned: true
  })
  id: number;

  // 參數名稱
  @Column('varchar', {
    length: 50,
    name: 'parameter'
  })
  @Index({ unique: true })
  parameter: string;
  
  // 參數值
  @Column('text', {
    name: 'value'
  })
  value: string;
}