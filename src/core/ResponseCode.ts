export enum RESPONSE_STATUS {
  'USER_SUCCESS' = 1000,
  'USER_NAME_IS_EMPTY' = 1201,
  'USER_ACCOUNT_IS_EMPTY' = 1202,
  'USER_PASSWORD_IS_EMPTY' = 1203,
  'USER_PORTER_TYPE_IS_EMPTY' = 1204,
  'USER_REPEAT_NAME' = 1301,
  'USER_REPEAT_ACCOUNT' = 1302,
  'USER_REPEAT_PORTER_TAG_NUMBER' = 1303,
  'USER_PORTER_TYPE_NOT_FOUND' = 1304,
  'USER_UNKNOWN' = 1999,
  'AUTH_SUCCESS' = 2000,
  'AUTH_ACCOUNT_IS_EMPTY' = 2201,
  'AUTH_PASSWORD_IS_EMPTY' = 2202,
  'AUTH_ID_IS_EMPTY' = 2203,
  'AUTH_TOKEN_IS_EMPTY' = 2204,
  'AUTH_LOGIN_FAIL' = 2301,
  'AUTH_INVALID_TOKEN' = 2302,
  'AUTH_TOKEN_EXPIRED' = 2303,
  'AUTH_ACCESS_FAIL' = 2304,
  'AUTH_ACCESS_DATA_FAIL' = 2305,
  'AUTH_UNKNOWN' = 2999,
  'DATA_SUCCESS' = 3000,
  'DATA_DELETE_SUCCESS' = 3001,
  'DATA_UPDATE_SUCCESS' = 3002,
  'DATA_CREATE_SUCCESS' = 3003,
  'DATA_REQUIRED_FIELD_IS_EMPTY' = 3201,
  'DATA_UPDATE_FAIL' = 3301,
  'DATA_REPEAT' = 3302,
  'DATA_CREATE_FAIL' = 3303,
  'DATA_UNKNOWN' = 3999
}