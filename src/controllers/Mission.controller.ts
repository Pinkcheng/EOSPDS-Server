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
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const list = (req: Request, res: Response) => {
  const days = parseInt(Formatter.formInput(req.query.days as string));
  const department = Formatter.formInput(req.query.department as string);
  const status = Formatter.formInput(req.query.status as string);

  const missionModel = new MissionModel();
  missionModel.list(days, department, parseInt(status))
    .then(missions => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missions));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const get = (req: Request, res: Response) => {
  const missionID = req.params.missionID as string;

  const missionModel = new MissionModel();
  missionModel.get(missionID)
    .then(missions => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, missions));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      console.error(err);
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const dispatch = (req: Request, res: Response) => {
  const dispatch = req.body.dispatch;
  const missionID = req.params.missionID;
  const porterID = req.body.porter;

  const missionModel = new MissionModel();
  if (dispatch === '1') {
    missionModel.manualDispatch(missionID, porterID)
      .then(() => {
        res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_UPDATE_SUCCESS));
      }, errCode => {
        res.status(400).json(ResponseHandler.message(errCode));
      }).catch(err => {
        console.error(err);
        res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
      });
  }
};

export const action = (req: Request, res: Response) => {
  const missionID = req.params.missionID;
  const action = req.body.action;
  const handover = req.body.handover;

  const missionModel = new MissionModel();
  if (action === '1') {
    missionModel.start(missionID, handover)
      .then(() => {
        res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_UPDATE_SUCCESS));
      }, errCode => {
        res.status(400).json(ResponseHandler.message(errCode));
      }).catch(err => {
        console.error(err);
        res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
      });
  } else if (action === '2') {
    missionModel.finish(missionID, handover)
      .then(() => {
        res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_UPDATE_SUCCESS));
      }, errCode => {
        res.status(400).json(ResponseHandler.message(errCode));
      }).catch(err => {
        console.error(err);
        res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
      });
  } else {
    res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
  }
};