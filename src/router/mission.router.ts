import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';
export const missionRouter = express.Router();
import * as missionController from '../controllers/mission.controller';

missionRouter.route('/')
  .post(whoCanDoIt(1), missionController.create)
  .get(whoCanDoIt(1), missionController.list);

missionRouter.route('/:missionID')
  .get(whoCanDoIt(1), missionController.get)
  .patch(whoCanDoIt(1), missionController.update)
  .delete(whoCanDoIt(1), missionController.del);

missionRouter.route('/:missionID/auto').get(whoCanDoIt(1), missionController.auto);
missionRouter.route('/:missionID/assign/:porterID').get(whoCanDoIt(1), missionController.assign);
missionRouter.route('/:missionID/start').get(whoCanDoIt(2), missionController.start);
missionRouter.route('/:missionID/finish').get(whoCanDoIt(2), missionController.finish);
