import * as Response from './ResponseCode';

export class ResponseHandler {
  static message(code: Response.RESPONSE_STATUS, data: any = {}) {
    const { USER_SUCCESS, USER_PORTER_TYPE_IS_EMPTY, USER_ACCOUNT_IS_EMPTY, USER_NAME_IS_EMPTY, USER_PASSWORD_IS_EMPTY, USER_REPEAT_NAME, USER_REPEAT_ACCOUNT, USER_REPEAT_PORTER_TAG_NUMBER, USER_UNKNOWN, USER_PORTER_TYPE_NOT_FOUND, AUTH_ACCOUNT_IS_EMPTY, AUTH_ID_IS_EMPTY, AUTH_INVALID_TOKEN, AUTH_LOGIN_FAIL, AUTH_PASSWORD_IS_EMPTY, AUTH_SUCCESS, AUTH_TOKEN_EXPIRED, AUTH_TOKEN_IS_EMPTY, AUTH_UNKNOWN } = Response.RESPONSE_STATUS;

    let message = '';

    switch (code) {
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
        message = '【警告：身份驗證】id為空';
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
      case AUTH_UNKNOWN:
        message = '【錯誤：身份驗證錯誤】發生非預期的錯誤';
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