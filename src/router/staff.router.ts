import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
import express from 'express';
const staffRouter = express.Router();
import * as staffController from '../controllers/Staff.controller';

staffRouter.route('/')
  .post(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), staffController.create)
  .get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), staffController.list);

staffRouter.route('/:staffID')
  .get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), staffController.get)
  .patch(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), staffController.update)
  .delete(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), staffController.del);

export default staffRouter;