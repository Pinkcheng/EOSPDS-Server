import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
import express from 'express';
const porterRouter = express.Router();
import * as porterController from '../controllers/Porter.controller';

porterRouter.route('/')
  .post(whoCanDoIt(SYSTEM_PERMISSION.PORTER_CENTER), porterController.create)
  .get(whoCanDoIt(SYSTEM_PERMISSION.PORTER), porterController.list);

porterRouter.route('/:porterID')
  .get(whoCanDoIt(SYSTEM_PERMISSION.PORTER), porterController.get)
  .patch(whoCanDoIt(SYSTEM_PERMISSION.PORTER), porterController.update)
  .delete(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), porterController.del);

export default porterRouter;