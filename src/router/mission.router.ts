import { minAccessLevel } from './../core/middlerware/Validate.middlerware';
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
  .post(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionController.create)
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionController.list);

missionRouter.route('/:missionID')
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionController.get);

missionRouter.route('/:missionID/dispatch')
  .post(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionController.dispatch);

missionRouter.route('/:missionID/action')
  .post(minAccessLevel(SYSTEM_PERMISSION.PORTER), missionController.action);

// =================== mission type ==================
missionTypeRouter.route('/')
  .post(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionTypeController.create)
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionTypeController.list);

missionTypeRouter.route('/:missionTypeID')
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionTypeController.get)
  .patch(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionTypeController.update)
  .delete(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionTypeController.del);

// =================== mission label ==================
missionLabelRouter.route('/')
  .post(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionLabelController.create)
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionLabelController.list);

missionLabelRouter.route('/:missionLabelID')
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionLabelController.get)
  .patch(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionLabelController.update)
  .delete(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionLabelController.del);

// =================== mission instrument ==================
missionInstrumentRouter.route('/')
  .post(minAccessLevel(SYSTEM_PERMISSION.PORTER_CENTER), missionInstrumentController.create)
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionInstrumentController.list);

missionInstrumentRouter.route('/:missionInstrumentID')
  .get(minAccessLevel(SYSTEM_PERMISSION.DEPARTMENT), missionInstrumentController.get)
  .patch(minAccessLevel(SYSTEM_PERMISSION.PORTER_CENTER), missionInstrumentController.update)
  .delete(minAccessLevel(SYSTEM_PERMISSION.SYSTEM_ADMINISTRATOR), missionInstrumentController.del);