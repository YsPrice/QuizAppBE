const {gql} = require('apollo-server');

const questionSchema = gql`
type Question {
id: ID!
content: String!
options: [Option!]!
quiz: Quiz!
}

extends type Query{
questions: [Question!]!
question(id:ID!): Question
}
`;

module.exports = questionSchema;