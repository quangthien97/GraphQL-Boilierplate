import bcryptjs from 'bcryptjs';

class HelpsPassword {
  static async compare(bodyPassword, userPassword) {
    return await bcryptjs.compare(bodyPassword, userPassword);
  }

  static async hash(requestPassword) {
    return await bcryptjs.hash(requestPassword, 8);
  }
}

export default HelpsPassword;
