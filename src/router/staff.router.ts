import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';
const staffRouter = express.Router();
import * as staffController from '../controllers/Staff.controller';

staffRouter.route('/')
  .post(whoCanDoIt(1), staffController.create)
  .get(whoCanDoIt(1), staffController.list);

staffRouter.route('/:staffID')
  .get(whoCanDoIt(2), staffController.get)
  .patch(whoCanDoIt(2), staffController.update)
  .delete(whoCanDoIt(1), staffController.del);

export default staffRouter;