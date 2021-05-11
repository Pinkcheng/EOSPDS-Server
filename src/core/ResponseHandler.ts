import * as Response from './ResponseCode';

export class ResponseHandler {
  static message(code: Response.RESPONSE_STATUS, data: any = {}) {
    const { USER_SUCCESS, USER_PORTER_TYPE_IS_EMPTY, USER_MOBILE_IS_EMPTY: USER_ACCOUNT_IS_EMPTY, USER_NAME_IS_EMPTY, USER_PASSWORD_IS_EMPTY, USER_REPEAT_NAME, USER_REPEAT_ACCOUNT, USER_REPEAT_PORTER_TAG_NUMBER, USER_UNKNOWN, USER_PORTER_TYPE_NOT_FOUND, AUTH_ACCOUNT_IS_EMPTY, AUTH_ID_IS_EMPTY, AUTH_INVALID_TOKEN, AUTH_LOGIN_FAIL, AUTH_PASSWORD_IS_EMPTY, AUTH_SUCCESS, AUTH_TOKEN_EXPIRED, AUTH_TOKEN_IS_EMPTY, AUTH_ACCESS_FAIL, AUTH_UNKNOWN, DATA_SUCCESS, DATA_DELETE_SUCCESS, DATA_REQUIRED_FIELD_IS_EMPTY, DATA_UNKNOWN, DATA_UPDATE_FAIL, DATA_REPEAT, DATA_UPDATE_SUCCESS, DATA_CREATE_SUCCESS, DATA_CREATE_FAIL, AUTH_ACCESS_DATA_FAIL, MISSION_NOT_DISPATCH } = Response.RESPONSE_STATUS;

    let message = '';

    switch (code) {
      // =============== 新增使用者 =====================
      case USER_SUCCESS:
        message = '傳送員資料新增成功';
        break;
      case USER_NAME_IS_EMPTY:
        message = '【警告：新增人員】人員姓名為空';
        break;
      case USER_ACCOUNT_IS_EMPTY:
        message = '【警告：新增人員】人員帳號為空';
        break;
      case USER_PASSWORD_IS_EMPTY:
        message = '【警告：新增人員】人員密碼為空';
        break;
      case USER_PORTER_TYPE_IS_EMPTY:
        message = '【警告：新增人員】傳送員類型為空';
        break;
      case USER_REPEAT_NAME:
        message = '【錯誤：新增人員】重複的姓名';
        break;
      case USER_REPEAT_ACCOUNT:
        message = '【錯誤：新增人員】重複的人員帳號';
        break;
      case USER_REPEAT_PORTER_TAG_NUMBER:
        message = '【錯誤：新增人員】重複的傳送人員標籤';
        break;
      case USER_PORTER_TYPE_NOT_FOUND:
        message = '【錯誤：新增人員】找不到傳送員類型';
        break;
      case USER_UNKNOWN:
        message = '【錯誤：新增人員】發生非預期的錯誤';
        break;
      // =============== 認證相關 =====================
      case AUTH_SUCCESS:
        message = '登入成功';
        break;
      case AUTH_ACCOUNT_IS_EMPTY:
        message = '【警告：身份驗證】登入帳號為空';
        break;
      case AUTH_PASSWORD_IS_EMPTY:
        message = '【警告：身份驗證】登入密碼為空';
        break;
      case AUTH_ID_IS_EMPTY:
        message = '【警告：身份驗證】授權人員的id為空';
        break;
      case AUTH_TOKEN_IS_EMPTY:
        message = '【警告：身份驗證】toke為空';
        break;
      case AUTH_LOGIN_FAIL:
        message = '【錯誤：身份驗證失敗】帳號或是密碼錯誤';
        break;
      case AUTH_INVALID_TOKEN:
        message = '【錯誤：身份驗證失敗】無效的token';
        break;
      case AUTH_TOKEN_EXPIRED:
        message = '【錯誤：身份驗證失敗】token已經過期';
        break;
      case AUTH_ACCESS_FAIL:
        message = '【錯誤：身份驗證失敗】您沒有訪問的權限';
        break;
      case AUTH_ACCESS_DATA_FAIL:
        message = '【錯誤：身份驗證失敗】您沒有查詢該資料的權限';
        break;
      case AUTH_UNKNOWN:
        message = '【錯誤：身份驗證錯誤】發生非預期的錯誤';
        break;
      // =============== 資料取得相關 =====================
      case DATA_SUCCESS:
        message = '取得資料成功';
        break;
      case DATA_DELETE_SUCCESS:
        message = '刪除資料成功';
        break;
      case DATA_UPDATE_SUCCESS:
        message = '更新資料成功';
        break;
      case DATA_CREATE_SUCCESS:
        message = '新增資料成功';
        break;
      case DATA_REQUIRED_FIELD_IS_EMPTY:
        message = '【錯誤：存取資料】必為欄位為空';
        break;
      case DATA_UPDATE_FAIL:
        message = '【錯誤：存取資料】更新資料錯誤';
        break;
      case DATA_CREATE_FAIL:
        message = '【錯誤：存取資料】新增資料錯誤';
        break;
      case DATA_REPEAT:
        message = '【錯誤：存取資料】資料重複';
        break;
      case DATA_UNKNOWN:
        message = '【錯誤：存取資料】發生非預期的錯誤';
        break;
      // =============== 任務相關 =====================
      case MISSION_NOT_DISPATCH:
        message = '【錯誤：任務】任務尚未指派給傳送員';
        break;
      default:
        throw (new Error('No have response message or code'));
    }

    return this.response(code, message, data);
  }

  static response(
    code: any,
    message: string = '',
    data: any = {}) {
    return {
      'status': code % 1000 === 0 ? 1 : 0,
      'code': code,
      'message': message,
      'data': data
    };
  }
}