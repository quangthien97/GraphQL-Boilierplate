import { ApolloError } from 'apollo-server-express';

function validation(schema, value) {
  const result = schema.validate(value);
  if (result.error) {
    throw new ApolloError(result.error.message);
  } else {
    return result.value
  }
}

export default validation;