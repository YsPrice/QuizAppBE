const {gql} = require('apollo-server');

const optionSchema = gql`
type Option{
id: ID!
content: String!
isCorrect: Boolean!
question: Question!

}

extend type Query{
options:[Option!]!
option(id:ID!):Option
}

extend type Mutation{
createOption(questionId: ID!, isCorrect: Boolean!,content: String!)
}
`;

module.exports = optionSchema;