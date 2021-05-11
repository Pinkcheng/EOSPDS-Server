import { UserModel } from '../../model/User.model';
import { ResponseHandler } from '../ResponseHandler';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { RESPONSE_STATUS } from '../ResponseCode';
import { SYSTEM_PERMISSION } from '../../entity/SystemPermission.entity';

export const auth = async (req: Request, res: Response, next: any) => {
  try {
    if (!req.header('Authorization')) {
      res.json(ResponseHandler.message(RESPONSE_STATUS.AUTH_TOKEN_IS_EMPTY));
      return;
    }
    // 從來自客戶端請求的 header 取得和擷取 JWT
    const token = req.header('Authorization').replace('Bearer ', '');
    // 驗證 Token
    const decoded = verify(token, process.env.JWT_SECRET);
    // 確認使用者傳過來的token，是否有在資料庫中，就是確認是否合法
    const userModel = new UserModel();
    const findUser = await userModel.findByToken(token);
    // 不合法就回傳，合法就繼續執行
    if (!findUser) {
      res.status(401).json(ResponseHandler.message(RESPONSE_STATUS.AUTH_INVALID_TOKEN));
    } else {
      // 記錄使用者資料
      req.body.__SESSION = findUser;
      next();
    }
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

export const minAccessLevel = (minPermissionID: SYSTEM_PERMISSION) => {
  return async (req: Request, res: Response, next: any) => {
    try {
      if (req.body.__SESSION.permission.id <= minPermissionID) {
        next();
      } else {
        res.status(401).json(ResponseHandler.message(RESPONSE_STATUS.AUTH_ACCESS_FAIL));
      }
    } catch (err) {
      next(err);
    }
  };
};