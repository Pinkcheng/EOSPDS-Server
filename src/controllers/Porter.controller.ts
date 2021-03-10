import { PorterTypeModel, PorterModel } from './../model/Porter.model';
import { ResponseHandler } from '../model/ResponseHandler.model';
import { Request, Response } from 'express';
import { ADD_PORTER_RESPONSE_STATUS as RESPONSE_STATUS } from '../model/ResponseCode';
import { FormFormatter } from '../model/FormFormatter.model';

export const add = (req: Request, res: Response) => {
  const id = FormFormatter.set(req.body.id);
  const name = FormFormatter.set(req.body.name);
  const account = FormFormatter.set(req.body.account).toLowerCase();
  const password = FormFormatter.set(req.body.password);
  const tagNumber = FormFormatter.set(req.body.tag);
  const type = FormFormatter.set(req.body.type);
  const birthday = FormFormatter.set(req.body.birthday);
  const gender = FormFormatter.set(req.body.gender);
  // 確認表單欄位是否有空值
  if (!name) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_NAME_IS_EMPTY));
    // return;
  } else if (!account) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_ACCOUNT_IS_EMPTY));
    // return;
  } else if (!password) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_PASSWORD_IS_EMPTY));
    // return;
  } else if (!type) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_TYPE_IS_EMPTY));
    // return;
  } else if (!id) {
    res.json(ResponseHandler.set(RESPONSE_STATUS.WARNING_ID_IS_EMPTY));
    // return;
  }
  // 檢查是否有重複的欄位
  const porterModel = new PorterModel();
  porterModel.findByID(id).then(porter => {
    if (!porter) {
      return porterModel.findByName(name);
    } else {
      res.json(ResponseHandler.set(RESPONSE_STATUS.ERROR_REPEAT_ID));
      throw 'repeat id';
    }
  }).then(porter => {
    if (!porter) {
      return porterModel.findByAccount(account);
    } else {
      res.json(ResponseHandler.set(RESPONSE_STATUS.ERROR_REPEAT_NAME));
      throw 'repeat name';
    }
  }).then(porter => {
    if (!porter) {
      return porterModel.findByTagNumber(tagNumber);
    } else {
      res.json(ResponseHandler.set(RESPONSE_STATUS.ERROR_REPEAT_ACCOUNT));
      throw 'repeat account';
    }
  }).then(porter => {
    if (!porter) {
      return new PorterTypeModel().findByTypeID(parseInt(type));
    } else {
      res.json(ResponseHandler.set(RESPONSE_STATUS.ERROR_REPEAT_TAG_NUMBER));
      throw 'repeat tag number';
    }
  }).then(porterType => {
    if (porterType) {
      porterModel.createPorter(
        id, name, account, password, tagNumber, porterType,
        birthday, gender === '1' ? true : false).then(newPorter => {
          res.json(ResponseHandler.set(RESPONSE_STATUS.SUCCESS));
        }, () => {
          res.json(ResponseHandler.set(RESPONSE_STATUS.ERROR_NUKNOWN));
          throw 'unknown error';
        });
    } else {
      res.json(ResponseHandler.set(RESPONSE_STATUS.ERROR_TYPE_NOT_FOUND));
      throw 'type not found';
    }
  }).catch(err => {
    console.log(err);
  });
};