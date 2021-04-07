import UserQueries from '../graphql/queries/user';
import db from '../models/index';


jest.mock('../graphql/queries/user')

describe('test mock get User', () => {
  test('should return mock user', async () => {
    UserQueries.getAllUsers.mockImplementation(() =>  ({ err: null, user: null, total: 0 }))
    const response = await UserQueries.getAllUsers(1,1,db)
  });

  
  test('should return mock user', async () => {
    UserQueries.getUserById.mockImplementation(() =>  ({ err: null, user: null}))
    const response = await UserQueries.getUserById(1,db)

    expect(response.err).toBeNull();
    expect(response.user).toBeNull();
  });
});


