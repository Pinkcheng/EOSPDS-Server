import { PorterModel } from './../model/Porter.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const add = (req: Request, res: Response) => {
  const name = Formatter.formInput(req.body.name);
  const account = Formatter.formInput(req.body.account);
  const password = Formatter.formInput(req.body.password);
  const tagNumber = Formatter.formInput(req.body.tag);
  const type = parseInt(Formatter.formInput(req.body.type));
  const birthday = Formatter.formInput(req.body.birthday);
  const gender = Formatter.formInput(req.body.gender);

  const porterModel = new PorterModel();
  porterModel.createPorter(
    name, account, password, type, tagNumber, birthday, 
    gender === '1' ? true : false)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.USER_SUCCESS));
    }, responseCode => {
      res.status(400).json(ResponseHandler.message(responseCode));
    });
};

