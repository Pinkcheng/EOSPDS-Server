import { PorterTypeModel, PorterModel } from './../model/Porter.model';
import { ResponseHandler } from '../model/ResponseHandler.model';
import { Request, Response } from 'express';
import { ADD_PORTER_RESPONSE_STATUS as RESPONSE_STATUS } from '../model/ResponseCode';
import { FormFormatter } from '../model/FormFormatter.model';

export const add = (req: Request, res: Response) => {
  const porterID = FormFormatter.set(req.body.id);
  const porterName = FormFormatter.set(req.body.name);
  const account = FormFormatter.set(req.body.account).toLowerCase();
  const password = FormFormatter.set(req.body.password);
  const tagNumber = FormFormatter.set(req.body.tag);
  const type = FormFormatter.set(req.body.type);
  const birthday = FormFormatter.set(req.body.birthday);
  const gender = FormFormatter.set(req.body.gender);

  if (!porterName) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_NAME_IS_EMPTY));
    return;
  } else if (!account) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_ACCOUNT_IS_EMPTY));
    return;
  } else if (!password) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_PASSWORD_IS_EMPTY));
    return;
  } else if (!type) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_TYPE_IS_EMPTY));
    return;
  } else if (!porterID) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_ID_IS_EMPTY));
    return;
  }

  const porterModel = new PorterModel();
  new PorterTypeModel().findByTypeID(1)
    .then(porterType => {
      const newPorter = porterModel.createPorter(
        porterID, porterName, account, password, tagNumber, porterType, 
        birthday, gender === '1' ? true : false);
    });


  res.json(ResponseHandler.set(RESPONSE_STATUS.ERROR_REPEAT_ACCOUNT));
};