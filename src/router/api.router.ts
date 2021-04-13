import express from 'express';
const apiRouter = express.Router();

import * as porterController from '../controllers/Porter.controller';

// TODO: 對應的api，應該要有對應的權限才能執行
//porter操作相關
apiRouter.post('/porter/add', porterController.add);

export default apiRouter;