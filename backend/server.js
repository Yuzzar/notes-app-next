const express = require('express');
const cors = require('cors'); 
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const schema = require('./graphql/schema');
const db = require('./models');

const app = express();

app.use(cors()); 

const executableSchema = makeExecutableSchema({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
});

app.use('/graphql', graphqlHTTP({
  schema: executableSchema,
  graphiql: true,  
}));

db.sequelize.sync().then(() => {
  app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
  });
});
