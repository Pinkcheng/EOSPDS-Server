import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';

export const data = {
  systemPermission: [
    [SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR, '系統管理員'],
    [SYSTEM_PERMISSION.PORTER_CENTER, '傳送中心'],
    [SYSTEM_PERMISSION.DEPARTMENT, '請求單位'],
    [SYSTEM_PERMISSION.PORTER, '傳送員']
  ],
  user: [ // id, permissionID, account, password
    ['-1', '0', process.env.ADMIN_ACCOUNT, process.env.ADMIN_ACCOUNT_PASSWORD]
  ],
  building: [
    ['B0001', '新醫療大樓'],
    ['B0002', '舊醫療大樓'],
    ['B0003', '急診大樓'],
    ['B0004', '復健大樓'],
    ['B0005', '精神衛生大樓'],
  ],
  instrument: [
    ['I0001', '輪椅'],
    ['I0002', '大床'],
    ['I0003', '小床'],
    ['I0004', '升降小床'],
  ],
  porterType: [
    ['全院'],
    ['駐點'],
    ['混合']
  ]
};