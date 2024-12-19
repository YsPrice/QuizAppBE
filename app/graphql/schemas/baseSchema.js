const { gql } = require('graphql-tag');

const baseSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

module.exports = baseSchema;
