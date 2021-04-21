import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';
const apiRouter = express.Router();

import * as porterController from '../controllers/Porter.controller';

//porter操作相關
apiRouter.post('/porter/add', whoCanDoIt(1), porterController.add);

export default apiRouter;