import { Op } from 'sequelize';
import HelperToken from '../helpers/token.helper';
import constants from '../core/constants';
const { userStatus, adminRoles } = constants.constants;

class ApiMiddleware {
  static async checkRole(req, res, next) {
    const token = req.header('authorization');
    if (!token) {
      req.isAuth = false;
      return next();
    }
    try {
      const verified = HelperToken.decode(token);
      const userData = await global.db.Users.findOne({
        where:
        {
          id: verified.id,
          // status: userStatus.verified,
          // role: {
          //   [Op.or]: [adminRoles.admin, adminRoles.superAdmin]
          // }
        }
      });
      if (!userData) {
        req.isAuth = false;
        return next();
      }
      if(userData.role === adminRoles.superAdmin) {
        req.isSuperAdmin = true;
      }
      req.isAuth = true;
      req.user = userData;
      return next();

    } catch (error) {
      req.isAuth = false;
      return next();
    }
  }
}

export default ApiMiddleware;
