import * as Response from './ResponseCode';

export class ResponseHandler {
  static addUser(code: Response.ADD_USER_RESPONSE_STATUS, data: any = {}) {
    const { SUCCESS, ID_IS_EMPTY, PORTER_TYPE_IS_EMPTY, ACCOUNT_IS_EMPTY, NAME_IS_EMPTY, PASSWORD_IS_EMPTY, REPEAT_NAME, REPEAT_ACCOUNT, REPEAT_PORTER_TAG_NUMBER, UNKNOWN, PORTER_TYPE_NOT_FOUND, REPEAT_ID, PERMISSION_IS_EMPTY, PERMISSION_NOT_FOUND } = Response.ADD_USER_RESPONSE_STATUS;

    let message = '';

    switch (code) {
      case SUCCESS:
        message = '傳送員資料新增成功';
        break;
      case NAME_IS_EMPTY:
        message = '【警告：新增人員】人員姓名為空';
        break;
      case ID_IS_EMPTY:
        message = '【警告：新增人員】人員編號為空';
        break;
      case ACCOUNT_IS_EMPTY:
        message = '【警告：新增人員】人員帳號為空';
        break;
      case PASSWORD_IS_EMPTY:
        message = '【警告：新增人員】人員密碼為空';
        break;
      case PORTER_TYPE_IS_EMPTY:
        message = '【警告：新增人員】傳送員類型為空';
        break;
      case PERMISSION_IS_EMPTY:
        message = '【警告：新增人員】人員權限為空';
        break;
      case REPEAT_NAME:
        message = '【錯誤：新增人員】重複的姓名';
        break;
      case REPEAT_ACCOUNT:
        message = '【錯誤：新增人員】重複的人員帳號';
        break;
      case REPEAT_PORTER_TAG_NUMBER:
        message = '【錯誤：新增人員】重複的傳送人員標籤';
        break;
      case PORTER_TYPE_NOT_FOUND:
        message = '【錯誤：新增人員】找不到傳送員類型';
        break;
      case REPEAT_ID:
        message = '【錯誤：新增人員】重複的人員編號';
        break;
      case PERMISSION_NOT_FOUND:
        message = '【錯誤：新增人員】找不到系統權限類型';
        break;
      case UNKNOWN:
        message = '【錯誤：新增人員】發生非預期的錯誤';
        break;
      default:
        throw (new Error('No have response message or code'));
    }

    return this.response(code, message, data);
  }

  static auth(code: Response.AUTH_RESPONSE_STATUS, data: any = {}) {
    const { SUCCESS, ACCOUNT_IS_EMPTY, PASSWORD_IS_EMPTY, TOKEN_IS_EMPTY, ID_IS_EMPTY, LOGIN_FAIL, INVALID_TOKEN, TOKEN_EXPIRED, UNKNOWN } = Response.AUTH_RESPONSE_STATUS;

    let message = '';

    switch (code) {
      case SUCCESS:
        message = '登入成功';
        break;
      case ACCOUNT_IS_EMPTY:
        message = '【警告：身份驗證】登入帳號為空';
        break;
      case PASSWORD_IS_EMPTY:
        message = '【警告：身份驗證】登入密碼為空';
        break;
      case ID_IS_EMPTY:
        message = '【警告：身份驗證】id為空';
        break;
      case TOKEN_IS_EMPTY:
        message = '【警告：身份驗證】toke為空';
        break;
      case LOGIN_FAIL:
        message = '【錯誤：身份驗證失敗】帳號或是密碼錯誤';
        break;
      case INVALID_TOKEN:
        message = '【錯誤：身份驗證失敗】無效的token';
        break;
      case TOKEN_EXPIRED:
        message = '【錯誤：身份驗證失敗】token已經過期';
        break;
      case UNKNOWN:
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