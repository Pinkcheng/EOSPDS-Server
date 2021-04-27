import { MissionTypeModel } from '../model/Mission.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const create = (req: Request, res: Response) => {
  const name = req.body.name;
  const transport = req.body.transport;

  const missionTypeModel = new MissionTypeModel();
  missionTypeModel.create(name, transport)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_CREATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const list = (req: Request, res: Response) => {
  const missionTypeModel = new MissionTypeModel();
  missionTypeModel.getAll()
    .then(missionTypeList => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missionTypeList));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const get = (req: Request, res: Response) => {
  const missionTypeModel = new MissionTypeModel();
  missionTypeModel.findByID(parseInt(req.params.missionTypeID))
    .then(missionType => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missionType));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const update = (req: Request, res: Response) => {
  const id = parseInt(Formatter.formInput(req.params.missionTypeID));
  const name = req.body.name;
  const transport = req.body.transport;

  const missionTypeModel = new MissionTypeModel();
  missionTypeModel.update(id, name, transport)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_UPDATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const del = (req: Request, res: Response) => {
  const missionTypeModel = new MissionTypeModel();
  missionTypeModel.del(parseInt(req.params.missionTypeID))
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_DELETE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};
