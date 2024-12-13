const {gql} = require('apollo-server');

const quizSchema = gql`
type Quiz{
id: ID!
title: String!
difficulty: String!
questions:[Question!]!
createdBy: User!

}
extends type Query{
quizzes: [Quiz!]!
quiz(id: ID!): Quiz
}
`;


module.exports = quizSchema;