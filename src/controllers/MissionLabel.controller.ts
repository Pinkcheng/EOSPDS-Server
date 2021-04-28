import { MissionLabelModel } from './../model/Mission.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const create = (req: Request, res: Response) => {
  const name = req.body.name;
  const missionTypeID = req.body.missionTypeID;

  const missionLabelModel = new MissionLabelModel();
  missionLabelModel.create(name, missionTypeID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_CREATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const list = (req: Request, res: Response) => {
  const missionLabelModel = new MissionLabelModel();
  missionLabelModel.getAll()
    .then(missionLabelList => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missionLabelList));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const get = (req: Request, res: Response) => {
  const missionLabelModel = new MissionLabelModel();
  missionLabelModel.findByID(req.params.missionLabelID)
    .then(missionLabel => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missionLabel));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const update = (req: Request, res: Response) => {
  const id = req.params.missionLabelID;
  const name = req.body.name;
  const missionTypeID = req.body.missionTypeID;

  const missionLabelModel = new MissionLabelModel();
  missionLabelModel.update(id, name, missionTypeID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_UPDATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const del = (req: Request, res: Response) => {
  const missionLabelModel = new MissionLabelModel();
  missionLabelModel.del(req.params.missionLabelID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_DELETE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};
