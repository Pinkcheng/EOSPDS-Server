import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';
const departmentRouter = express.Router();
import * as departmentController from '../controllers/Department.controllers';

departmentRouter.route('/')
  .post(whoCanDoIt(1), departmentController.create)
  .get(whoCanDoIt(1), departmentController.list);

departmentRouter.route('/:porterID')
  .get(whoCanDoIt(2), departmentController.get)
  .patch(whoCanDoIt(2), departmentController.update)
  .delete(whoCanDoIt(1), departmentController.del);

export default departmentRouter;
