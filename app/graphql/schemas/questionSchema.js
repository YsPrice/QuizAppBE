const {gql} = require('apollo-server');

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

extend type Mutation{
createQuestion(quizId: ID!, content:String!): Question!
}
`;

module.exports = questionSchema;