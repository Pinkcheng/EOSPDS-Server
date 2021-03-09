import { ADD_PORTER_RESPONSE_STATUS } from '../ResponseCode';

export class ResponseHandler {
  static set(code: ADD_PORTER_RESPONSE_STATUS, data: Array<any> = []) {
    const { SUCCESS, ERROR_REPEAT_NAME, ERROR_REPEAT_ACCOUNT, ERROR_REPEAT_TAG_NUMBER, ERROR_NUKNOWN } = ADD_PORTER_RESPONSE_STATUS;

    let message = '';

    switch (code) {
      case SUCCESS:
        message = '傳送員資料新增成功';
        break;
      case ERROR_REPEAT_NAME:
        message = '傳送員資料新增失敗，重複的傳送員姓名';
        break;
      case ERROR_REPEAT_ACCOUNT:
        message = '傳送員資料新增失敗，重複的傳送員帳號';
        break;
      case ERROR_REPEAT_TAG_NUMBER:
        message = '傳送員資料新增失敗，重複的標籤編號';
        break;
      case ERROR_NUKNOWN:
        message = '傳送員資料新增失敗，發生非預期的錯誤';
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