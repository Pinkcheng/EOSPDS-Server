import { Porter } from './../entity/Porter.entity';
import dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';

// Read .env files settings
dotenv.config();

export class Authentication {
  private token: string;

  // constructor(porter: Porter) {
  constructor() {
    this.token = sign({
      // id: porter.ID,
      // permission: porter.permission
    }, process.env.JWT_SECRET, {
      expiresIn: '1 day'
    });
  }

  getSign() {
    return this.token;
  }
}