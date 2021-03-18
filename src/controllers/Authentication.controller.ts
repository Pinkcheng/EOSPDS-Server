import { Request, Response } from 'express';
import { FormFormatter } from '../library/FormFormatter.lib';
import { Authentication } from '../library/Authentication.lib';
import { ResponseHandler } from '../library/ResponseHandler.lib';
import { AUTH_RESPONSE_STATUS } from '../library/ResponseCode';

export const login = (req: Request, res: Response) => {
  const account = FormFormatter.set(req.body.account);
  const password = FormFormatter.set(req.body.password);
  
  const auth = new Authentication();
  auth.login(account, password)
    .then(token => {
      res.json(ResponseHandler.auth(AUTH_RESPONSE_STATUS.SUCCESS, { token: token }));
    }, status => {
      console.log('login fail');
      res.json(ResponseHandler.auth(status));
    });
};