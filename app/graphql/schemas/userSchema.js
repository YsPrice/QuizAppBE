const { gql } = require('graphql-tag');


const userSchema = gql`
type User {
id: ID!
email:String!
userName:String!
quizzes:[Quiz!]!
quizzesMade:Int!
quizzesCompleted:Int!
savedQuizzes: [ID!]!
quizzesTaken: [ID!]! 
}
type AuthPayload {
user: User!
token: String!
}

extend type Query{
users:[User!]!
user(id:ID!): User
 getQuizzesTaken: [Quiz!]! 
  getSavedQuizzes: [Quiz!]!
    getCreatedQuizzes(userId: ID!): [Quiz!]!
}

extend type Mutation{
signUp(email:String!,password:String!,userName:String!): AuthPayload!
logIn(email:String!,password:String!):AuthPayload!
logOut:Message!
deleteUser(id:ID!): User!
 saveQuiz(quizId: ID!): User! 
 unsaveQuiz(quizId: ID!): User!
  completeQuiz(quizId: ID!): User!

}
type Message {
  message: String!
}
`;

module.exports = userSchema;