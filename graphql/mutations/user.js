import HelperPassword from '../../helpers/password.helper';
import HelperResponse from '../../helpers/response.helper';
import HelperToken from '../../helpers/token.helper';
import { constants } from '../../core/constants';
const { adminRoles } = constants;

class UserMutation {
  static async login(email, password, db) {
    try {
      const user = await db.Users.findOne({ where: { email } });
      if (!user) {
        return HelperResponse.authUser(null, 'Wrong Mail', null);
      }
      const result = await HelperPassword.compare(password, user.password);
      if (result) {
        const token = HelperToken.encode(user.id);
        await db.Users.update({ lastLoginAt: new Date() }, { where: { id: user.id } });
        return HelperResponse.authUser(user, 'login successful', token);
      } else {
        return HelperResponse.authUser(null, 'Wrong Password', null);
      }
    } catch (err) {
      return HelperResponse.authUser(null, err.message, null);
    }
  }

  static async create(newUser, { Users }) {
    try {
      let { name, email, password, role, status } = newUser;
      const checkEmail = await Users.findOne({ where: { email: email } });
      if (checkEmail) {
        return {
          user: null,
          error: 'Email must be Unique'
        }
      }
      newUser.password = await HelperPassword.hash(newUser.password)
      const result = await Users.create(newUser);
      return {
        user: result,
        error: null
      }
    } catch (err) {
      return {
        user: null,
        error: err.message
      }
    }
  }

  static async edit(id, { name, password, role }, req, { Users }) {
    try {
      const userData = {};
      if (role) {
        if (req.user.role === adminRoles.superAdmin && req.user.id === id) {
          return {
            user: null,
            err: 'Can not change role user have role Super Admin'
          }
        }
        if (req.user.role === adminRoles.admin && role === adminRoles.superAdmin) {
          return {
            user: null,
            err: 'Permission denied'
          }
        }
        userData.role = role;
      }
      if (name) {
        userData.name = name
      }
      if (password) {
        userData.password = await HelperPassword.hash(password);
      }

      const result = await Users.update(
        userData, { where: { id } }
      );
      const user = await Users.findOne({ where: { id } });
      return { user, err: null };
    } catch (err) {
      return { user: null, err: err.message };
    }
  }

  static async changeUserStatus(id, status, action = '', { Users }) {
    try {
      if (action !== 'Active') {
        const userDetail = await Users.findOne({ where: { id } });
        if (!userDetail) {
          return HelperResponse.returnNotification(id, 'Can not find user by this ID', false);
        }
        if (userDetail.role === adminRoles.superAdmin) {
          return HelperResponse.returnNotification(id, 'Do not have permission', false);
        }
      }
      const result = await Users.update(
        { status },
        { where: { id } }
      );
      if (result.length && !result[0]) {
        return HelperResponse.returnNotification(id, action + ' failed', false);
      }
      return HelperResponse.returnNotification(id, action + ' success', true);
    } catch (err) {
      return HelperResponse.returnNotification(id, err.message, false);
    }
  }
}

export default UserMutation;