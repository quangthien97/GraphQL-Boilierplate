import {
  defaultFieldResolver
} from "graphql";

import {
  AuthenticationError,
  SchemaDirectiveVisitor
} from 'apollo-server-express';

export class IsSuperAdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
      const {
          resolve = defaultFieldResolver
      } = field;

      field.resolve = async function (...args) {
          let [_, {}, {
              user,
              isSuperAdmin
          }] = args;
          if (isSuperAdmin) {
              const result = await resolve.apply(this, args);
              return result;
          } else {
              throw new AuthenticationError(
                  'You do not have permission'
              );
          }
      };
  }
}