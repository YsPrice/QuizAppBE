const { gql } = require('graphql-tag');

const questionSchema = gql`
type Question {
id: ID!
content: String!
options: [Option!]!
quiz: Quiz!
}

extend type Query{
questions: [Question!]!
question(id:ID!): Question
}
type Message {
  message: String!
}

extend type Mutation{
createQuestion(quizId: ID!, content:String!): Question!
deleteQuestion(id: ID): Message!
editQuestion(id:ID,content:String!):Question!
}
`;

module.exports = questionSchema;