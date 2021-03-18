import { PorterModel } from './../model/Porter.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { ADD_PORTER_RESPONSE_STATUS as RESPONSE_STATUS } from '../core/ResponseCode';
import { FormFormatter } from '../core/FormFormatter';

export const add = (req: Request, res: Response) => {
  const id = FormFormatter.set(req.body.id);
  const name = FormFormatter.set(req.body.name);
  const account = FormFormatter.set(req.body.account);
  const password = FormFormatter.set(req.body.password);
  const tagNumber = FormFormatter.set(req.body.tag);
  const type = parseInt(FormFormatter.set(req.body.type));
  const permission = parseInt(FormFormatter.set(req.body.permission));
  const birthday = FormFormatter.set(req.body.birthday);
  const gender = FormFormatter.set(req.body.gender);
  
  // 檢查是否有重複的欄位
  const porterModel = new PorterModel();
  porterModel.createPorter(
    id, name, account, password, tagNumber, type, permission,
    birthday, gender === '1' ? true : false, () => {
      res.json(ResponseHandler.addPorter(RESPONSE_STATUS.SUCCESS));
    }, (responseStatus: RESPONSE_STATUS) => {
      res.status(400).json(ResponseHandler.addPorter(responseStatus));
    });
};

