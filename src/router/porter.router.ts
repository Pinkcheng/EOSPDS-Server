import { whoCanDoIt } from './../core/middlerware/Validate.middlerware';
import express from 'express';
const porterRouter = express.Router();
import * as porterController from '../controllers/Porter.controller';

porterRouter.post('/porter/add', whoCanDoIt(1), porterController.add);

export default porterRouter;