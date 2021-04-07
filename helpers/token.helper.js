import jwt from 'jsonwebtoken';
require('dotenv').config();

class HelpersToken {
  static encode(userId) {
    return jwt.sign({ id: userId }, process.env.CLIENT_SECRET_TOKEN);
  }

  static decode(token) {
    return jwt.verify(token, process.env.CLIENT_SECRET_TOKEN);
  }
}

export default HelpersToken;
