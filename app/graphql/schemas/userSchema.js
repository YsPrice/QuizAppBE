const {gql} = require('apollo-server');

const userSchema = gql`
type User {
id: ID!
email:String!
userName:String!
quizzes:[Quiz!]!
quizzesMade:Int!
quizzesCompleted:Int!
}

extend type Query{
users:[User!]!
user(id:ID!): User
}
`;

module.exports = userSchema;