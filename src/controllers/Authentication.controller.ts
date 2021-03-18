import { Request, Response } from 'express';
import { Authentication } from '../library/Authentication.lib';

export const login = (req: Request, res: Response) => {
  const auth = new Authentication();
  console.log(auth);
  res.json('[]');
};