import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';
export const departmentRouter = express.Router();
export const buildingRouter = express.Router();
import * as departmentController from '../controllers/Department.controller';

departmentRouter.route('/')
  .post(whoCanDoIt(0), departmentController.create)
  .get(whoCanDoIt(2), departmentController.list);

departmentRouter.route('/:departmentID')
  .get(whoCanDoIt(2), departmentController.get)
  .patch(whoCanDoIt(0), departmentController.update)
  .delete(whoCanDoIt(0), departmentController.del);

buildingRouter.route('/')
  .get(whoCanDoIt(2), departmentController.buildingList);
