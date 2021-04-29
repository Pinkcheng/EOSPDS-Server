import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';
import { MissionModel } from '../model/Mission.model';

export const create = (req: Request, res: Response) => {
  const missionModel = new MissionModel();
  missionModel.create('L0001', 'D0001', 'D0001', '531病床 王小明', 'I0001')
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_CREATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });

};