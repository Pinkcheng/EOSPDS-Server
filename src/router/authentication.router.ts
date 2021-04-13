import express from 'express';
const authRouter = express.Router();

import * as authController from '../controllers/Authentication.controller';

//porter操作相關
authRouter.post('/login', authController.login);
authRouter.post('/alogin', authController.alogin);

export default authRouter;