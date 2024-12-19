const { gql } = require('graphql-tag');

const optionSchema = gql`
type Option{
id: ID!
content: String!
isCorrect: Boolean!
question: Question!

}

extend type Query{
options(questionId:ID!):[Option!]!
option(id:ID!):Option
}
type Message {
  message: String!
}
extend type Mutation{
createOption(questionId: ID!, isCorrect: Boolean!,content: String!): Option!
deleteOption(questionId: ID!, optionId: ID!): Message!
editOption(questionId: ID!, optionId: ID!, isCorrect: Boolean, content:String): Option!
}
`;

module.exports = optionSchema;