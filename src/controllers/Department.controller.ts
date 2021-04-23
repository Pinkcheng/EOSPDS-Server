import { DepartmentModel } from '../model/Department.model';
import { BuildingModel } from '../model/Building.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const create = (req: Request, res: Response) => {
  const id = Formatter.formInput(req.body.id);
  const name = req.body.name;

  const departmentModel = new DepartmentModel();
  departmentModel.create(id, name)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_CREATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const list = (req: Request, res: Response) => {
  const departmentModel = new DepartmentModel();
  departmentModel.getAll()
    .then(departmentList => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, departmentList));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const buildingList = (req: Request, res: Response) => {
  const buildingModel = new BuildingModel();
  buildingModel.getAll()
    .then(buildingList => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, buildingList));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const get = (req: Request, res: Response) => {
  const departmentModel = new DepartmentModel();
  departmentModel.findByID(req.params.departmentID)
    .then(department => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, department));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const update = (req: Request, res: Response) => {
  const id = Formatter.formInput(req.params.departmentID);
  const name = req.body.name;

  const departmentModel = new DepartmentModel();
  departmentModel.update(id, name)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_UPDATE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const del = (req: Request, res: Response) => {
  const departmentModel = new DepartmentModel();
  departmentModel.del(req.params.departmentID)
    .then(() => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_DELETE_SUCCESS));
    }, errCode => {
      res.status(400).json(ResponseHandler.message(errCode));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};