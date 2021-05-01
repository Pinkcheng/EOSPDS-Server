import { MissionInstrumentModel } from '../model/Mission.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const create = (req: Request, res: Response) => {
  const name = req.body.name;
  const id = req.body.id;

  const missionInstrumentModel = new MissionInstrumentModel();
  missionInstrumentModel.create(id, name)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_CREATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const list = (req: Request, res: Response) => {
  const missionInstrumentModel = new MissionInstrumentModel();
  missionInstrumentModel.getAll()
    .then(missionInstrumentList => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missionInstrumentList));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const get = (req: Request, res: Response) => {
  const missionInstrumentModel = new MissionInstrumentModel();
  missionInstrumentModel.findByID(req.params.missionInstrumentID)
    .then(missionInstrument => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missionInstrument));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const update = (req: Request, res: Response) => {
  const id = Formatter.formInput(req.params.missionInstrumentID);
  const name = req.body.name;

  const missionInstrumentModel = new MissionInstrumentModel();
  missionInstrumentModel.update(id, name)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_UPDATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const del = (req: Request, res: Response) => {
  const missionInstrumentModel = new MissionInstrumentModel();
  missionInstrumentModel.del(req.params.missionInstrumentID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_DELETE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};
