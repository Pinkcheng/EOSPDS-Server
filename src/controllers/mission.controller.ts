import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';
import { MissionModel } from '../model/Mission.model';

export const create = (req: Request, res: Response) => {
  const labelID = Formatter.formInput(req.body.label);
  const startDepartmentID = Formatter.formInput(req.body.start);
  const endDepartmentID = Formatter.formInput(req.body.end);
  const content = req.body.content;
  const instrumnetID = Formatter.formInput(req.body.instrument);

  const missionModel = new MissionModel();
  missionModel.create(labelID, startDepartmentID, endDepartmentID, content, instrumnetID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_CREATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const list = (req: Request, res: Response) => {
  const days = parseInt(Formatter.formInput(req.query.days as string));
  
  const missionModel = new MissionModel();
  missionModel.list(days)
    .then(missions => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missions));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};