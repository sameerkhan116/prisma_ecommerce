import React, { Component } from 'react';
import { ActivityIndicator, View, AsyncStorage } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { TOKEN_KEY } from '../constants';

class CheckToken extends Component {
  componentDidMount = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      this.props.history.push('/signup');
      return;
    }
    let response;
    try {
      response = await this.props.mutate();
      console.log(response);
    } catch (err) {
      this.props.history.push('/signup');
      return;
    }
    const { refreshToken: { token: newToken } } = response.data;
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    this.props.history.push('/products');
  }

  render() {
    return (
      <View style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

const CHECK_REFRESH_TOKEN = gql`
  mutation {
    refreshToken {
      token
      userId
    }
  }
`;

const graphqlComponent = graphql(CHECK_REFRESH_TOKEN)(CheckToken);

export default graphqlComponent;
