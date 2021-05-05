import { minAccessLevel } from './../core/middlerware/Validate.middlerware';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
import express from 'express';
const staffRouter = express.Router();
import * as staffController from '../controllers/Staff.controller';

staffRouter.route('/')
  .post(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), staffController.create)
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), staffController.list);

staffRouter.route('/:staffID')
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), staffController.get)
  .patch(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), staffController.update)
  .delete(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), staffController.del);

export default staffRouter;