const {gql} = require('apollo-server');

const quizSchema = gql`
type Quiz{
id: ID!
title: String!
difficulty: String!
questions:[Question!]!
createdBy: User!

}
extend type Query{
quizzes: [Quiz!]!
quiz(id: ID!): Quiz
}
extend type Mutation {
  createQuiz( title: String!, difficulty: String!): Quiz!
  editQuiz(id: ID!, title:String,difficulty:String):Quiz!
  deleteQuiz(id:ID!):Quiz!
}

`;


module.exports = quizSchema;