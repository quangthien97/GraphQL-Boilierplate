import UserMutation from '../mutations/user';
import UserQueries from '../queries/user';
import { constants } from '../../core/constants';
const { userStatus } = constants;
import { login, create, get, update, changeStatus } from '../../validations/user.validation';
import validation from '../../validations/index';

export default {
  Query: {
    getAllUser: async (_, { getInput }, { db }) => {
      validation(get, getInput);
      const { limit, page } = getInput;
      return UserQueries.getAllUsers(page, limit, db);
    },
    getUserById: async (_, { id }) => {
      return UserQueries.getUserById(id);
    }
  },
  Mutation: {
    login: async (_, { email, password }, { db }) => {
      validation(login, { email, password });
      return UserMutation.login(email, password, db);
    },
    createNewUser: async (_, { newUser }, { db }) => {
      validation(create, newUser);
      return UserMutation.create(newUser, db);
    },
    editUserById: async (_, { updateUser, id }, { req, db }) => {
      validation(update, updateUser);
      return UserMutation.edit(id, updateUser, req, db);
    },
    deleteUserById: async (_, { id }, { db }) => {
      validation(changeStatus, userStatus.deleted);
      return UserMutation.changeUserStatus(id, userStatus.deleted, 'Delete', db);
    },
    activeUserById: async (_, { id }, { db }) => {
      validation(changeStatus, userStatus.verified);
      return UserMutation.changeUserStatus(id, userStatus.verified, 'Active', db);
    },
    inactiveUserById: async (_, { id }, { db }) => {
      validation(changeStatus, userStatus.inactive);
      return UserMutation.changeUserStatus(id, userStatus.inactive, 'Inactive', db);
    }
  }
}