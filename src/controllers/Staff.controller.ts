import { StaffModel } from './../model/Staff.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const create = (req: Request, res: Response) => {
  const name = req.body.name;
  const account = Formatter.formInput(req.body.account);
  const password = Formatter.formInput(req.body.password);
  const professional = req.body.professional;
  const departmentID = req.body.department;

  const statffModel = new StaffModel();
  statffModel.create(name, account, password, professional, departmentID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_CREATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const list = (req: Request, res: Response) => {
  const departmentID = req.query.department as string;
  
  const statffModel = new StaffModel();
  statffModel.list(departmentID)
    .then(missionTypeList => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missionTypeList));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const get = (req: Request, res: Response) => {
  const staffID = Formatter.formInput(req.params.staffID);

  const statffModel = new StaffModel();
  statffModel.get(staffID)
    .then(missionType => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missionType));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const update = (req: Request, res: Response) => {
  const staffID = Formatter.formInput(req.params.staffID);
  const professional = req.body.professional;
  const departmentID = req.body.department;
  const name = req.body.name;

  const statffModel = new StaffModel();
  statffModel.update(staffID, name, professional,departmentID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_UPDATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const del = (req: Request, res: Response) => {
  const statffModel = new StaffModel();
  statffModel.del(req.params.staffID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_DELETE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};
