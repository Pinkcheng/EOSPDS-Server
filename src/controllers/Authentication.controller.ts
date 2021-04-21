import { UserModel } from '../model/User.model';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { ResponseHandler } from '../core/ResponseHandler';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const login = (req: Request, res: Response) => {
  const account = Formatter.formInput(req.body.account);
  const password = Formatter.formInput(req.body.password);

  const userModel = new UserModel();
  userModel.login(account, password)
    .then(token => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.AUTH_SUCCESS, token));
    }, responseCode => {
      res.status(400).json(ResponseHandler.message(responseCode));
    });
};