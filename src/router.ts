import express from 'express';
const router = express.Router();

import * as porterController from './controllers/Porter.controller';

//porter操作相關
router.post('/porter/add', porterController.add);

export default router;