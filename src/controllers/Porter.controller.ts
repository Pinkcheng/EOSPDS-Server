import { PorterModel } from './../model/Porter.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const create = (req: Request, res: Response) => {
  const name = Formatter.formInput(req.body.name);
  const account = Formatter.formInput(req.body.account);
  const password = Formatter.formInput(req.body.password);
  const tagNumber = Formatter.formInput(req.body.tag);
  const type = parseInt(Formatter.formInput(req.body.type));
  const birthday = Formatter.formInput(req.body.birthday);
  const gender = Formatter.formInput(req.body.gender);
  const department = Formatter.formInput(req.body.department);

  const porterModel = new PorterModel();
  porterModel.create(
    name, account, password, type, tagNumber, birthday, gender === '1' ? 1 : 2, department)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.USER_SUCCESS));
    }, responseCode => {
      res.status(400).json(ResponseHandler.message(responseCode));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.USER_UNKNOWN));
    });
};

export const list = (req: Request, res: Response) => {
  const porterModel = new PorterModel();
  porterModel.allAll()
    .then(porterList => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, porterList));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const get = (req: Request, res: Response) => {
  const porterModel = new PorterModel();
  porterModel.findByID(req.params.porterID)
    .then(porter => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, porter));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const update = (req: Request, res: Response) => {

};

export const del = (req: Request, res: Response) => {
  const porterModel = new PorterModel();
  porterModel.del(req.params.porterID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_DELETE_SUCCESS));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};
