const { gql } = require('graphql-tag');
const quizSchema = gql`
type Quiz{
id: ID!
title: String
status: QuizStatus!
difficulty: String
questions:[Question!]!
createdBy: User!

}
extend type Query{
quizzes: [Quiz!]!
quiz(id: ID!): Quiz
quizzesByStatus(status: QuizStatus!): [Quiz!]!
allQuizzes: [Quiz!]!
}
type Message {
  message: String!
}
extend type Mutation {
  createQuiz( title: String, status:QuizStatus!,difficulty: String): Quiz!
  editQuiz(id: ID!, title:String,difficulty:String,status:QuizStatus!):Quiz!
  deleteQuiz(id:ID!):Message!
}

enum QuizStatus {
  DRAFT
  PUBLISHED
}
  
`;



module.exports = quizSchema;