const { gql } = require('graphql-tag');
const quizSchema = gql`
type Quiz{
id: ID!
title: String!
status: QuizStatus!
difficulty: String!
questions:[Question!]!
createdBy: User!

}
extend type Query{
quizzes: [Quiz!]!
quiz(id: ID!): Quiz
}
type Message {
  message: String!
}
extend type Mutation {
  createQuiz( title: String!, difficulty: String!): Quiz!
  editQuiz(id: ID!, title:String,difficulty:String):Quiz!
  deleteQuiz(id:ID!):Message!
}

enum QuizStatus {
  DRAFT
  PUBLISHED
}
`;


module.exports = quizSchema;