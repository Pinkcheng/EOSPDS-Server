import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';
const porterRouter = express.Router();
import * as porterController from '../controllers/Porter.controller';

porterRouter.route('/')
  .post(whoCanDoIt(1), porterController.create)
  .get(whoCanDoIt(1), porterController.list);

porterRouter.route('/:porterID')
  .get(whoCanDoIt(2), porterController.get)
  .patch(whoCanDoIt(2), porterController.update)
  .delete(whoCanDoIt(1), porterController.del);

export default porterRouter;