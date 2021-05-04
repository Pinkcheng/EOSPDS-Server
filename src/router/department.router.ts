import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
import express from 'express';
export const departmentRouter = express.Router();
export const buildingRouter = express.Router();
import * as departmentController from '../controllers/Department.controller';

departmentRouter.route('/')
  .post(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), departmentController.create)
  .get(whoCanDoIt(SYSTEM_PERMISSION.PORTER_CENTER), departmentController.list);

departmentRouter.route('/:departmentID')
  .get(whoCanDoIt(SYSTEM_PERMISSION.PORTER_CENTER), departmentController.get)
  .patch(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), departmentController.update)
  .delete(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), departmentController.del);

buildingRouter.route('/')
  .get(whoCanDoIt(SYSTEM_PERMISSION.PORTER_CENTER), departmentController.buildingList);
