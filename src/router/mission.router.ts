import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';

export const missionRouter = express.Router();
export const missionTypeRouter = express.Router();
export const missionLabelRouter = express.Router();
export const missionInstrumentRouter = express.Router();

import * as missionController from '../controllers/Mission.controller';
import * as missionTypeController from '../controllers/MissionType.controller';
import * as missionLabelController from '../controllers/MissionLabel.controller';
import * as missionInstrumentController from '../controllers/MissionInstrument.controller';

// =================== mission ==================
missionRouter.route('/')
  .post(whoCanDoIt(1), missionController.create);

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

// =================== mission instrument ==================
missionInstrumentRouter.route('/')
.post(whoCanDoIt(1), missionInstrumentController.create)
.get(whoCanDoIt(1), missionInstrumentController.list);

missionInstrumentRouter.route('/:missionInstrumentID')
  .get(whoCanDoIt(1), missionInstrumentController.get)
  .patch(whoCanDoIt(1), missionInstrumentController.update)
  .delete(whoCanDoIt(1), missionInstrumentController.del);