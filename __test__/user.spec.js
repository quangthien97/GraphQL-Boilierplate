import UserMutation from '../graphql/mutations/user';
import UserQueries from '../graphql/queries/user';
import { constants } from '../core/constants';
const { adminRoles, userStatus } = constants;
import db from '../models/index';

const input = {
  email: "createUser1@gmail.com",
  password: "123123",
  name: "STAFF"
};
const inputUnique = {
  email: "createUserUnique@gmail.com",
  password: "123123",
  name: "STAFF UNIQUE",
  role: "ADMIN"
};
const adminInput = {
  name: 'ADMIN',
  role: 'ADMIN',
  email: 'testAdmin@gmail.com',
  password: '123123'
};
const superAdminInput = {
  name: 'SUPER ADMIN',
  role: 'SUPER_ADMIN',
  email: 'testSuperAdmin@gmail.com',
  password: '123123'
};

describe('User test case', () => {
  beforeAll(async () => {
    const superAdmin = await UserMutation.create(superAdminInput, db);
    superAdminInput.id = superAdmin.user.id;
    superAdminInput.password = '123123';
    const admin = await UserMutation.create(adminInput, db)
    adminInput.id = admin.user.id;
    const createUser = await UserMutation.create(input, db);
    input.id = createUser.user.id;
  });

  afterAll(async () => {
    await db.Users.destroy({
      where: {
        email:[
            'testSuperAdmin@gmail.com', 
            'testAdmin@gmail.com', 
            'createUserUnique@gmail.com',
             "createUser1@gmail.com"
             ]
      },
      force: true,
      logging: false
    });
  });
  
  it('get', async () => {
    const getResponse = await UserQueries.getAllUsers(1, 5, db);
    for (const user of getResponse.user) {
      expect(user.email).not.toBeNull();
      expect(user.password).not.toBeNull();
      expect(user.name).not.toBeNull();
      expect(Object.values(adminRoles).includes(user.role)).toEqual(true);
      expect(Object.values(userStatus).includes(user.status)).toEqual(true);
    }
    expect(getResponse.total).toBeGreaterThanOrEqual(0);
  })
  it('get error', async () => {
    const getResponse = await UserQueries.getAllUsers(1, 'awdawd', db);

    expect(getResponse.total).toBeGreaterThanOrEqual(0);
    expect(getResponse.user).toEqual(null);
    expect(getResponse.err).toEqual('Undeclared variable: NaN');
  })

  it('create duplicate email', async () => {
    const loginResponse = await UserMutation.create(input, db);

    expect(loginResponse.error).toEqual("Email must be Unique");
    expect(loginResponse.user).toBeNull();
  })

  it('create unique email', async () => {
    const createResponse = await UserMutation.create(inputUnique, db);

    expect(createResponse.error).toEqual(null);
    expect(createResponse.user).not.toBeNull();
  })

  it('edit user', async () => {
    const req = {
      user: {
        role: superAdminInput.role,
        id: superAdminInput.id
      }
    }
    const editInput = { password: "123123", name: "testEdit" };
    const responseEdit = await UserMutation.edit(input.id, editInput, req, db);

    expect(responseEdit.err).toBeNull();
    expect(responseEdit.user).not.toBeNull();
  });

  it('edit user admin', async () => {
    const req = {
      user: {
        role: superAdminInput.role,
        id: superAdminInput.id
      }
    }
    const editInput = { password: "123123", name: "test", role: "STAFF" };
    const responseEdit = await UserMutation.edit(superAdminInput.id, editInput, req, db);

    expect(responseEdit.err).toEqual('Can not change role user have role Super Admin');
    expect(responseEdit.user).toBeNull();
  });

  it('Admin edit user to role Super admin', async () => {
    const req = {
      user: {
        role: adminInput.role,
        id: adminInput.id
      }
    }
    const editInput = { password: "123123", name: "awdawdawdwad", role: "SUPER_ADMIN" };
    const responseEdit = await UserMutation.edit(superAdminInput.id, editInput, req, db);

    expect(responseEdit.err).toEqual('Permission denied');
    expect(responseEdit.user).toBeNull();
  });

  it('get by id', async () => {
    const getResponse = await UserQueries.getUserById(superAdminInput.id, db);

    expect(getResponse.email).not.toBeNull();
    expect(getResponse.password).not.toBeNull();
    expect(getResponse.name).not.toBeNull();
    expect(Object.values(adminRoles).includes(getResponse.user.role)).toEqual(true);
    expect(Object.values(userStatus).includes(getResponse.user.status)).toEqual(true);
  })

  it('get by id wrong', async () => {
    const idInputUser = 'f1awdawdwadwad3bf68e-d579-4d0a-b63e-a321878e01cc';
    const getResponse = await UserQueries.getUserById(idInputUser, db);

    expect(getResponse.err).toBeNull();
    expect(getResponse.user).toBeNull();
  })

  it('get by id equal null', async () => {
    const idInputUser = null;
    const getResponse = await UserQueries.getUserById(idInputUser, db);

    expect(getResponse.err).toBeNull();
    expect(getResponse.user).toBeNull();
  })

  it('get by id error', async () => {
    const idInputUser = NaN;
    const getResponse = await UserQueries.getUserById(idInputUser, db);

    expect(getResponse.user).toBeNull();
  })

  it('login', async () => {
    const loginResponse = await UserMutation.login(superAdminInput.email, superAdminInput.password, db);

    expect(loginResponse.message).toEqual('login successful');
    expect(loginResponse.token).not.toBeNull();
    expect(loginResponse.user).not.toBeNull();
  });

  it('login wrong email', async () => {
    const loginResponse = await UserMutation.login('wrongEmail@gmail.com', '123123123', db);

    expect(loginResponse.message).toEqual('Wrong Mail');
    expect(loginResponse.token).toBeNull();
    expect(loginResponse.user).toBeNull();
  });

  it('login wrong password', async () => {
    const loginResponse = await UserMutation.login(superAdminInput.email, '123123123', db);

    expect(loginResponse.message).toEqual('Wrong Password');
    expect(loginResponse.token).toBeNull();
    expect(loginResponse.user).toBeNull();
  });

  it('login error', async () => {
    const loginResponse = await UserMutation.login(superAdminInput.email, superAdminInput.password, {});

    expect(loginResponse.message).toEqual("Cannot read property 'findOne' of undefined");
    expect(loginResponse.token).toBeNull();
    expect(loginResponse.user).toBeNull();
  });

  it('active user by id', async () => {
    const activeResponse = await UserMutation.changeUserStatus(input.id, userStatus.verified, 'Active', db);

    expect(activeResponse.message).toEqual('Active success');
    expect(activeResponse.id).not.toBeNull();
    expect(activeResponse.success).not.toBeNull();
  });

  it('active user by id equal null', async () => {
    const idInputUser = null;
    const activeResponse = await UserMutation.changeUserStatus(idInputUser, userStatus.verified, 'Active', db);

    expect(activeResponse.message).toEqual('Active failed');
    expect(activeResponse.id).toBeNull();
    expect(activeResponse.success).not.toBeNull();
  });

  it('active user by wrong id', async () => {
    const idInputUser = '12312wewf234342';
    const activeResponse = await UserMutation.changeUserStatus(idInputUser, userStatus.verified, 'Active', db);

    expect(activeResponse.message).toEqual('Active failed');
    expect(activeResponse.id).not.toBeNull();
    expect(activeResponse.success).not.toBeNull();
  });

  it('Inactive user by id', async () => {
    const inactiveResponse = await UserMutation.changeUserStatus(input.id, userStatus.inactive, 'Inactive', db);

    expect(inactiveResponse.message).toEqual('Inactive success');
    expect(inactiveResponse.id).not.toBeNull();
    expect(inactiveResponse.success).not.toBeNull();
  });

  it('Inactive user by id equal null', async () => {
    const idInputUser = null;
    const inactiveResponse = await UserMutation.changeUserStatus(idInputUser, userStatus.inactive, 'Inactive', db);
    expect(inactiveResponse.message).toEqual('Can not find user by this ID');
    expect(inactiveResponse.id).toBeNull();
    expect(inactiveResponse.success).not.toBeNull();
  });

  it('Inactive user by wrong id', async () => {
    const idInputUser = '12312wewf234342';
    const inactiveResponse = await UserMutation.changeUserStatus(idInputUser, userStatus.inactive, 'Inactive', db);
    expect(inactiveResponse.message).toEqual('Can not find user by this ID');
    expect(inactiveResponse.id).not.toBeNull();
    expect(inactiveResponse.success).not.toBeNull();
  });

  it('Delete user by id', async () => {
    const deleteResponse = await UserMutation.changeUserStatus(input.id, userStatus.deleted, 'Delete', db);
    expect(deleteResponse.message).toEqual('Delete success');
    expect(deleteResponse.id).not.toBeNull();
    expect(deleteResponse.success).not.toBeNull();
  });

  it('Delete user by id equal null', async () => {
    const idInputUser = null;
    const deleteResponse = await UserMutation.changeUserStatus(idInputUser, userStatus.deleted, 'Delete', db);
    expect(deleteResponse.message).toEqual('Can not find user by this ID');
    expect(deleteResponse.id).toBeNull();
    expect(deleteResponse.success).not.toBeNull();
  });

  it('Delete user by wrong id', async () => {
    const idInputUser = '12312wewf234342';
    const deleteResponse = await UserMutation.changeUserStatus(idInputUser, userStatus.deleted, 'Delete', db);
    expect(deleteResponse.message).toEqual('Can not find user by this ID');
    expect(deleteResponse.id).not.toBeNull();
    expect(deleteResponse.success).not.toBeNull();
  });

  it('Delete Super Admin', async () => {
    const deleteResponse = await UserMutation.changeUserStatus(superAdminInput.id, userStatus.deleted, 'Delete', db);

    expect(deleteResponse.message).toEqual('Do not have permission');
    expect(deleteResponse.id).not.toBeNull();
    expect(deleteResponse.success).toEqual(false);
  });

  it('Change user status error', async () => {
    const deleteResponse = await UserMutation.changeUserStatus(superAdminInput.id, userStatus.deleted, 'Delete', {});
    expect(deleteResponse.message).toEqual("Cannot read property 'findOne' of undefined");
    expect(deleteResponse.success).toEqual(false);
  });
});