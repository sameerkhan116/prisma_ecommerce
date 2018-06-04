import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import Routes from './routes';

const link = createHttpLink({ uri: 'http://10.0.0.32:4000' });
const cache = new InMemoryCache();

const client = new ApolloClient({ link, cache });

export default () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);
