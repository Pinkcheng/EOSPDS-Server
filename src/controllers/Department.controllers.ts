import { BuildingModel } from './../model/Building.model';
import { ResponseHandler } from '../core/ResponseHandler';
import { Request, Response } from 'express';
import { Formatter } from '../core/Formatter';
import { RESPONSE_STATUS } from '../core/ResponseCode';

export const create = (req: Request, res: Response) => {
  const id = Formatter.formInput(req.body.bid);
  const name = Formatter.formInput(req.body.name);
};

export const list = (req: Request, res: Response) => {

};

export const buildingList = (req: Request, res: Response) => {
  const buildingModel = new BuildingModel();
  buildingModel.getAll()
    .then(buildingList => {
      res.json(ResponseHandler.message(RESPONSE_STATUS.DATA_SUCCESS, buildingList));
    }).catch(err => {
      res.status(400).json(ResponseHandler.message(RESPONSE_STATUS.DATA_UNKNOWN));
    });
};

export const get = (req: Request, res: Response) => {

};

export const update = (req: Request, res: Response) => {

};

export const del = (req: Request, res: Response) => {

};