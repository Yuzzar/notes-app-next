import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:4000/graphql';

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    
  },
});

export default graphQLClient;
