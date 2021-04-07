import {
  gql
} from 'apollo-server-express';

export default gql`
      extend type Query {
        getAllUser(getInput:GetUserInput): Users! @isAuth
        getUserById(id: ID!): getOneUser! @isAuth
      },
      extend type Mutation {
        login(email:String!, password:String!): AuthUser!
        createNewUser(newUser:UserInput): CreateUser! @isSuperAdmin
        editUserById(updateUser:UserEditInput, id:ID!): CreateUser! @isAuth
        deleteUserById(id:ID!): UserNotification! @isSuperAdmin
        activeUserById(id:ID!): UserNotification! @isAuth
        inactiveUserById(id:ID!): UserNotification! @isAuth
      }
      input GetUserInput{
        limit: Int,
        page: Int
      }
      input UserInput {
        name: String!,
        email: String!,
        password: String!,
        role: String,
        status: String
      }
      input UserEditInput {
        name: String,
        password: String,
        role: String,
        status: String
      }
      type User {
        id: ID!
        name: String!
        email: String!
        password: String
        role: String
        status: String
        deletedAt: String
        lastLoginAt: String
        createdAt: String
        updatedAt: String
        total: Int
      }
      type CreateUser {
        user: User
        err: String
      }
      type getOneUser {
        user: User
        err: String
      }
      type UserNotification {
        id: ID
        message: String!
        success: Boolean
        token: String
      }
      type Users{
        user: [User!]!,
        total: Int!
        err: String
      }
      type AuthUser {
        message: String!
        user: User
        token: String
      }
`;