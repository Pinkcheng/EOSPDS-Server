import { ADD_PORTER_RESPONSE_STATUS } from './ResponseCode';

export class ResponseHandler {
  static set(code: ADD_PORTER_RESPONSE_STATUS, data: Array<any> = []) {
    const { SUCCESS, WARNING_ID_IS_EMPTY, WARNING_TYPE_IS_EMPTY, WARNING_ACCOUNT_IS_EMPTY, WARNING_NAME_IS_EMPTY, WARNING_PASSWORD_IS_EMPTY, ERROR_REPEAT_NAME, ERROR_REPEAT_ACCOUNT, ERROR_REPEAT_TAG_NUMBER, ERROR_NUKNOWN, ERROR_TYPE_NOT_FOUND, ERROR_REPEAT_ID, WARNING_PERMISSION_IS_EMPTY, ERROR_PERMISSION_NOT_FOUND } = ADD_PORTER_RESPONSE_STATUS;

    let message = '';

    switch (code) {
      case SUCCESS:
        message = '傳送員資料新增成功';
        break;
      case WARNING_NAME_IS_EMPTY:
        message = '【警告：新增傳送員】傳送員姓名為空';
        break;
      case WARNING_ID_IS_EMPTY:
        message = '【警告：新增傳送員】傳送員編號為空';
        break;
      case WARNING_ACCOUNT_IS_EMPTY:
        message = '【警告：新增傳送員】傳送員帳號為空';
        break;
      case WARNING_PASSWORD_IS_EMPTY:
        message = '【警告：新增傳送員】傳送員密碼為空';
        break;
      case WARNING_TYPE_IS_EMPTY:
        message = '【警告：新增傳送員】傳送員類型為空';
        break;
      case WARNING_PERMISSION_IS_EMPTY:
        message = '【警告：新增傳送員】傳送員權限為空';
        break;
      case ERROR_REPEAT_NAME:
        message = '【錯誤：新增傳送員】重複的傳送員姓名';
        break;
      case ERROR_REPEAT_ACCOUNT:
        message = '【錯誤：新增傳送員】重複的傳送員帳號';
        break;
      case ERROR_REPEAT_TAG_NUMBER:
        message = '【錯誤：新增傳送員】重複的標籤編號';
        break;
      case ERROR_TYPE_NOT_FOUND:
        message = '【錯誤：新增傳送員】找不到傳送員類型';
        break;
      case ERROR_REPEAT_ID:
        message = '【錯誤：新增傳送員】重複的傳送員編號';
        break;
      case ERROR_PERMISSION_NOT_FOUND:
        message = '【錯誤：新增傳送員】找不到傳送員權限類型';
        break;
      case ERROR_NUKNOWN:
        message = '【錯誤：新增傳送員】發生非預期的錯誤';
        break;
      default:
        throw (new Error('No have response message or code'));
    }

    return this.response(code, message, data);
  }

  static response(
    code: ADD_PORTER_RESPONSE_STATUS,
    message: string = '',
    data: Array<any> = []) {
    return {
      'status': code % 1000 === 0 ? 1 : 0,
      'code': code,
      'message': message,
      'data': data
    };
  }
}