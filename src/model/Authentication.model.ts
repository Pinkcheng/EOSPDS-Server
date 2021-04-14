import { sign } from 'jsonwebtoken';
import { compare as comparePassword } from 'bcrypt';

import dotenv from 'dotenv';
// Read .env files settings
dotenv.config();

export class AuthenticationModel {
  generateAccessToken(
    id: string,
    name: string,
    permission: number,
    expires: string = process.env.ACCESS_TOKEN_DEFAULT_TIMEOUT
  ) {
    return sign({
      id: id,
      name: name,
      permission: permission
    }, process.env.JWT_SECRET,
      { expiresIn: expires });
  }

  comparePassword(input: string, encrypted: string) {
    return comparePassword(input, encrypted);
  }
}