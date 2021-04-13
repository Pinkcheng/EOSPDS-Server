import { ResponseHandler } from '../ResponseHandler';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AUTH_RESPONSE_STATUS } from '../ResponseCode';

export const auth = (req: Request, res: Response, next: any) => {
  try {
    if (!req.header('Authorization')) {
      res.json(ResponseHandler.auth(AUTH_RESPONSE_STATUS.WARNING_TOKEN_IS_EMPTY));
      return;
    }
    // 從來自客戶端請求的 header 取得和擷取 JWT
    // TODO: 認證是否要確認編號
    const token = req.header('Authorization').replace('Bearer ', '');
    // 驗證 Token
    const decoded = verify(token, process.env.JWT_SECRET);
    // 傳送員編號不能為空
    if (!req.body.id) {
      res.json(ResponseHandler.auth(AUTH_RESPONSE_STATUS.WARNING_ID_IS_EMPTY));
      return;
    }
    // 無效的token，解碼後的傳送員id，和表單傳過來的不同
    if (req.body.id !== decoded.id +'') {
      res.json(ResponseHandler.auth(AUTH_RESPONSE_STATUS.ERROR_INVALID_TOKEN));
      return;
    }

    next();
  } catch (err) {
    // token過期例外處理
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json(ResponseHandler.auth(AUTH_RESPONSE_STATUS.ERROR_INVALID_TOKEN));
    // token無效例外處理
    } else if (err.name === 'TokenExpiredError') {
      res.status(401).json(ResponseHandler.auth(AUTH_RESPONSE_STATUS.ERROR_TOKEN_EXPIRED));
    } else {
      console.error(err);
      res.status(401).json(ResponseHandler.auth(AUTH_RESPONSE_STATUS.ERROR_UNKNOWN));
    }
  }
};