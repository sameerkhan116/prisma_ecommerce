import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
// import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';

import Routes from './routes';
import { TOKEN_KEY } from './constants';

const uploadLink = createUploadLink({ uri: 'http://10.0.0.32:4000' });
const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = authLink.concat(uploadLink);
const cache = new InMemoryCache();

const client = new ApolloClient({ link, cache });

export default () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);
