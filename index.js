import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { PORT } from './config/index.config';
import db from './models/index';
import { schemaDirectives } from './graphql/directives/index';
import ApiMiddleware from './middleware/auth.middleware';
import resolvers from './graphql/resolvers/index';
import typeDefs from './graphql/typeDefs/index';

const app = express();
app.use(ApiMiddleware.checkRole);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: true,
  context: ({ req }) => {
    const { user, isAuth, isSuperAdmin } = req;
    return {
      db,
      req,
      user,
      isAuth,
      isSuperAdmin
    };
  }
});

(async () => {
  try {
    server.applyMiddleware({ app });
    await app.listen(PORT);
    console.log(`API started on port: ${PORT}`);
  } catch (err) {
    console.log(err);
  }
})();