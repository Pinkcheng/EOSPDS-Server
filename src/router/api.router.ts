import express from 'express';
const apiRouter = express.Router();

import porterRouter from './porter.router';
import departmentRouter from './department.router';

apiRouter.use('/porter', porterRouter);
apiRouter.use('/departmentRouter', departmentRouter);

export default apiRouter;