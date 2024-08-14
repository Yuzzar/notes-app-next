const { gql } = require('graphql-tag');
const resolvers = require('./resolvers');

const typeDefs = gql`
  type Note {
    id: ID!
    title: String!
    body: String!
    createdAt: String!
  }

  type Query {
    notes: [Note]
    note(id: ID!): Note
  }

  type Mutation {
    addNote(title: String!, body: String!): Note
    updateNote(id: ID!, title: String, body: String): Note
    deleteNote(id: ID!): Note
  }
`;

module.exports = {
  typeDefs,
  resolvers,
};
