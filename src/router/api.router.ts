import express from 'express';
const apiRouter = express.Router();

import * as porterController from '../controllers/Porter.controller';
import { auth } from '../core/middlerware/Authentication';

//porter操作相關
apiRouter.post('/porter/add', auth, porterController.add);

export default apiRouter;