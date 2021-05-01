export const data = {
  systemPermission: [
    ['0', '系統管理員'],
    ['1', '重送中心'],
    ['2', '請求單位'],
    ['3', '傳送員']
  ],
  user: [ // id, permissionID, account, password
    ['-1', '0', process.env.ADMIN_ACCOUNT, process.env.ADMIN_ACCOUNT_PASSWORD]
  ],
  building: [
    ['B01', '新醫療大樓'],
    ['B02', '舊醫療大樓'],
    ['B03', '急診大樓'],
    ['B04', '復健大樓'],
    ['B05', '精神衛生大樓'],
  ]
};