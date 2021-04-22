import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';
const departmentRouter = express.Router();
import * as departmentController from '../controllers/Department.controllers';

departmentRouter.route('/')
  .post(whoCanDoIt(0), departmentController.create)
  .get(whoCanDoIt(2), departmentController.list);

departmentRouter.route('/:departmentID')
  .get(whoCanDoIt(2), departmentController.get)
  .patch(whoCanDoIt(0), departmentController.update)
  .delete(whoCanDoIt(0), departmentController.del);

departmentRouter.route('/building')
  .get(whoCanDoIt(2), departmentController.buildingList);

export default departmentRouter;
