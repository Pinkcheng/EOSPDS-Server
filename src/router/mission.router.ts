import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';

export const missionRouter = express.Router();
export const missionTypeRouter = express.Router();
export const missionLabelRouter = express.Router();

import * as missionController from '../controllers/Mission.controller';
import * as missionTypeController from '../controllers/MissionType.controller';
import * as missionLabelController from '../controllers/MissionLabel.controller';

// =================== mission ==================
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

// =================== mission type ==================
missionTypeRouter.route('/')
.post(whoCanDoIt(1), missionTypeController.create)
.get(whoCanDoIt(1), missionTypeController.list);

missionTypeRouter.route('/:missionTypeID')
  .get(whoCanDoIt(1), missionTypeController.get)
  .patch(whoCanDoIt(1), missionTypeController.update)
  .delete(whoCanDoIt(1), missionTypeController.del);

// =================== mission label ==================
missionLabelRouter.route('/')
.post(whoCanDoIt(1), missionLabelController.create)
.get(whoCanDoIt(1), missionLabelController.list);

missionLabelRouter.route('/:missionLabelID')
  .get(whoCanDoIt(1), missionLabelController.get)
  .patch(whoCanDoIt(1), missionLabelController.update)
  .delete(whoCanDoIt(1), missionLabelController.del);