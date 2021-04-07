import UserMutation from '../graphql/mutations/user';
import db from '../models/index';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
import { constants } from '../core/constants';
const { adminRoles, userStatus } = constants;

jest.mock('../graphql/mutations/user');

describe('test mock user mutation', () => {
  test('should return mock user', async () => {
    UserMutation.login.mockImplementation(() => ({
      user: null,
      message: 'login false',
      token: null,
    }));
    const response = await UserMutation.login(1, 1, db);

    expect(response.token).toBeNull();
    expect(response.user).toBeNull();
    expect(response.message).toEqual('login false');
  });

  test('should return mock user', async () => {
    UserMutation.login.mockImplementation(() => ({
      user: {
        id: 'id1',
        name: 'name1',
        email: 'email1',
        password: 'password1',
        role: 'admin',
      },
      message: 'login success',
      token: 'adwart234ed22',
    }));
    const response = await UserMutation.login(1, 1, db);

    expect(response.token).not.toBeNull();
    expect(response.user.id).toEqual('id1');
    expect(response.user.name).toEqual('name1');
    expect(response.user.email).toEqual('email1');
    expect(response.user.password).toEqual('password1');
    expect(response.user.role).toEqual('admin');
    expect(response.message).toEqual('login success');
  });

  test('should return mock create User duplicate', async () => {
    UserMutation.create.mockImplementation(() => ({
      user: null,
      error: 'Email must be Unique',
    }));
    const newUser = {
      email: 'unknownEmail@gmail.com',
      password: '123123',
      name: 'unknownName',
    };
    const response = await UserMutation.create(newUser, db);

    expect(response.user).toEqual(null);
    expect(response.error).toEqual('Email must be Unique');
  });

  test('should return mock create User', async () => {
    UserMutation.create.mockImplementation(() => ({
      user: {
        email: 'unknownEmail@gmail.com',
        password: '123123',
        name: 'unknownName',
      },
      error: null,
    }));
    const newUser = {
      email: 'unknownEmail@gmail.com',
      password: '123123',
      name: 'unknownName',
    };
    const response = await UserMutation.create(newUser, db);

    expect(response.user).toMatchObject(newUser);
    expect(response.error).toBeNull();
  });

  test('should return mock create User', async () => {
    UserMutation.create.mockImplementation(() => ({
      user: {
        email: 'unknownEmail@gmail.com',
        password: '123123',
        name: 'unknownName',
      },
      error: null,
    }));
    const newUser = {
      email: 'unknownEmail@gmail.com',
      password: '123123',
      name: 'unknownName',
    };
    const response = await UserMutation.create(newUser, db);

    expect(response.user).toMatchObject(newUser);
    expect(response.error).toBeNull();
  });

  test('should error Permission denied', async () => {
    UserMutation.edit.mockImplementation(() => ({
      err: 'Permission denied',
      user: null,
    }));

    const editUser = {
      password: '123123',
      name: 'unknownName',
      role: 'SUPER_ADMIN',
    };

    const response = await UserMutation.edit(editUser, db);

    expect(response.user).toBeNull();
    expect(response.err).toEqual('Permission denied');
  });

  test('should error when change role of user Super Admin', async () => {
    UserMutation.edit.mockImplementation(() => ({
      err: 'Can not change role user have role Super Admin',
      user: null,
    }));
    const req = {
      role: 'SUPER_ADMIN',
      email: 'superAdmin@gmail.com',
      name: 'SUPER ADMIN',
      password: '123123',
    };
    const editUser = {
      id: 'id',
      password: '123123',
      name: 'unknownName',
      role: 'SUPER_ADMIN',
    };
    const responseEdit = await UserMutation.edit(
      editUser.id,
      editUser,
      req,
      db
    );
    const response = await UserMutation.edit(editUser, db);

    expect(response.user).toBeNull();
    expect(response.err).toEqual(
      'Can not change role user have role Super Admin'
    );
  });

  test('should return success create User', async () => {
    UserMutation.edit.mockImplementation(() => ({
      err: null,
      user: {
        id: 'id',
        password: '123123',
        name: 'unknownName',
        role: 'SUPER_ADMIN',
      },
    }));
    const req = {
      role: 'SUPER_ADMIN',
      email: 'superAdmin@gmail.com',
      name: 'SUPER ADMIN',
      password: '123123',
    };
    const editUser = {
      id: 'id',
      password: '123123',
      name: 'unknownName',
      role: 'SUPER_ADMIN',
    };
    const responseEdit = await UserMutation.edit(
      editUser.id,
      editUser,
      req,
      db
    );

    expect(responseEdit.user).toMatchObject(editUser);
    expect(responseEdit.err).toBeNull();
  });

  test('should return not found User', async () => {
    UserMutation.changeUserStatus.mockImplementation(() => ({
      user: null,
      message: 'User not found',
    }));
    const user = {
      id: 'id',
      role: 'STAFF',
      email: 'staff@gmail.com',
      name: 'staff',
      password: '123123',
    };
    const response = await UserMutation.changeUserStatus(
      user.id,
      userStatus.verified,
      'Active',
      db
    );

    expect(response.user).toBeNull();
    expect(response.message).toEqual('User not found');
  });

  test('should return change status success', async () => {
    UserMutation.changeUserStatus.mockImplementation(() => ({
      id: null,
      message: 'Active success',
      success: true,
    }));
    
    const user = {
      id: 'id',
      role: 'STAFF',
      email: 'staff@gmail.com',
      name: 'staff',
      password: '123123',
    };
    const response = await UserMutation.changeUserStatus(
      user.id,
      userStatus.verified,
      'Active',
      db
    );

    expect(response.success).toBeTruth();
    expect(response.message).toEqual('Active success');
  });


});
