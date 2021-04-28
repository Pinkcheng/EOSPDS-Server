import { missionRouter, missionTypeRouter, missionLabelRouter } from './mission.router';
import express from 'express';
const apiRouter = express.Router();

import porterRouter from './porter.router';
import { departmentRouter, buildingRouter } from './department.router';

apiRouter.use('/porter', porterRouter);
apiRouter.use('/department', departmentRouter);
apiRouter.use('/building', buildingRouter);
apiRouter.use('/mission', missionRouter);
apiRouter.use('/mission_type', missionTypeRouter);
apiRouter.use('/mission_label', missionLabelRouter);

export default apiRouter;