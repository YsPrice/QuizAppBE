const { gql } = require('graphql-tag');


const userSchema = gql`
type User {
id: ID!
email:String!
userName:String!
quizzes:[Quiz!]!
quizzesMade:Int!
quizzesCompleted:Int!
}
type AuthPayload {
user: User!
token: String!
}

extend type Query{
users:[User!]!
user(id:ID!): User
}

extend type Mutation{
signUp(email:String!,password:String!,userName:String!): AuthPayload!
logIn(email:String!,password:String!):AuthPayload!
logOut:Message!
deleteUser(id:ID!): User!
}
type Message {
  message: String!
}
`;

module.exports = userSchema;