import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import { SYSTEM_PERMISSION } from '../entity/SystemPermission.entity';
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
  .post(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionController.create)
  .get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionController.list);

missionRouter.route('/:missionID')
  .get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionController.get);

  missionRouter.route('/:missionID/dispatch')
  .post(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionController.dispatch);

// =================== mission type ==================
missionTypeRouter.route('/')
.post(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionTypeController.create)
.get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionTypeController.list);

missionTypeRouter.route('/:missionTypeID')
  .get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionTypeController.get)
  .patch(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionTypeController.update)
  .delete(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionTypeController.del);

// =================== mission label ==================
missionLabelRouter.route('/')
.post(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionLabelController.create)
.get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionLabelController.list);

missionLabelRouter.route('/:missionLabelID')
  .get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionLabelController.get)
  .patch(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionLabelController.update)
  .delete(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionLabelController.del);

// =================== mission instrument ==================
missionInstrumentRouter.route('/')
.post(whoCanDoIt(SYSTEM_PERMISSION.PORTER_CENTER), missionInstrumentController.create)
.get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionInstrumentController.list);

missionInstrumentRouter.route('/:missionInstrumentID')
  .get(whoCanDoIt(SYSTEM_PERMISSION.DEPARTMENT), missionInstrumentController.get)
  .patch(whoCanDoIt(SYSTEM_PERMISSION.PORTER_CENTER), missionInstrumentController.update)
  .delete(whoCanDoIt(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionInstrumentController.del);