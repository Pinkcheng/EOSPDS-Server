import { ResponseHandler } from '../ResponseHandler';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { RESPONSE_STATUS } from '../ResponseCode';

export const auth = (req: Request, res: Response, next: any) => {
  try {
    const userID = req.body.userID;

    if (!req.header('Authorization')) {
      res.json(ResponseHandler.message(RESPONSE_STATUS.AUTH_TOKEN_IS_EMPTY));
      return;
    }
    // 從來自客戶端請求的 header 取得和擷取 JWT
    const token = req.header('Authorization').replace('Bearer ', '');
    // 驗證 Token
    const decoded = verify(token, process.env.JWT_SECRET);
    // 人員編號不能為空
    if (!userID) {
      res.json(ResponseHandler.message(RESPONSE_STATUS.AUTH_ID_IS_EMPTY));
      return;
    }
    // 無效的token，解碼後的人員d，和表單傳過來的不同
    if (userID !== decoded.id + '') {
      res.json(ResponseHandler.message(RESPONSE_STATUS.AUTH_INVALID_TOKEN));
      return;
    }

    next();
  } catch (err) {
    // token過期例外處理
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json(ResponseHandler.message(RESPONSE_STATUS.AUTH_INVALID_TOKEN));
      // token無效例外處理
    } else if (err.name === 'TokenExpiredError') {
      res.status(401).json(ResponseHandler.message(RESPONSE_STATUS.AUTH_TOKEN_EXPIRED));
    } else {
      console.error(err);
      res.status(401).json(ResponseHandler.message(RESPONSE_STATUS.AUTH_UNKNOWN));
    }
  }
};