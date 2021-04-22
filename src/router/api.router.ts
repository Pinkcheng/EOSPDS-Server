import express from 'express';
const apiRouter = express.Router();

import porterRouter from './porter.router';

apiRouter.use('/porter', porterRouter);

export default apiRouter;