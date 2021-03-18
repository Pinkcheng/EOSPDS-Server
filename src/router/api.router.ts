import express from 'express';
const apiRouter = express.Router();

import * as porterController from '../controllers/Porter.controller';

//porter操作相關
apiRouter.post('/porter/add', porterController.add);

export default apiRouter;