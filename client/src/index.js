import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import Routes from './routes';
import { TOKEN_KEY } from './constants';

const localhost = '10.0.0.32:4000';

const wsLink = new WebSocketLink({
  uri: `ws://${localhost}`,
  options: {
    reconnect: true,
  },
});
const uploadLink = createUploadLink({ uri: `http://${localhost}` });
const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const concatLink = ApolloLink.from([
  authLink,
  uploadLink,
]);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  concatLink,
);
const cache = new InMemoryCache();

const client = new ApolloClient({ link, cache });

export default () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);
