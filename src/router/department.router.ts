import { minAccessLevel } from './../core/middlerware/Validate.middlerware';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
import express from 'express';
export const departmentRouter = express.Router();
export const buildingRouter = express.Router();
import * as departmentController from '../controllers/Department.controller';

departmentRouter.route('/')
  .post(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), departmentController.create)
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), departmentController.list);

departmentRouter.route('/:departmentID')
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), departmentController.get)
  .patch(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), departmentController.update)
  .delete(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), departmentController.del);

buildingRouter.route('/')
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), departmentController.buildingList);
