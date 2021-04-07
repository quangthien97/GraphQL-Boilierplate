import HelperPagination from '../../helpers/pagination.helper';

class UserQueries {
  static async getAllUsers(page = 1, limit = 1, { Users }) {
    try {
      let options = {
        order: [
          ['createdAt', 'DESC']
        ]
      };
      options = HelperPagination.optionPagination(options, { getLimit: limit, page });
      const usersData = await Users.findAndCountAll(options);
      return {
        user: usersData.rows,
        total: usersData.count,
        err: null
      };
    } catch (err) {
      return {
        user: null,
        total: 0,
        err: err.message
      };
    }
  }

  static async getUserById(id, { Users }) {
    try {
      const user = await Users.findOne({ where: { id } });
      return { user, err: null };
    } catch (err) {
      return { user: null, err: err.message };
    }
  }
}

export default UserQueries;