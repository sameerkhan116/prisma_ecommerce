import React, { Component } from 'react';
import { AsyncStorage, Text, Button, View, StyleSheet } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import TextField from '../components/TextField';
import { TOKEN_KEY } from '../constants';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondary: {
    width: 300,
  },
  error: {
    color: 'red',
  },
});

const defaultState = {
  values: {
    name: '',
    email: '',
    password: '',
  },
  errors: {},
  isSubmitting: false,
};

class Signup extends Component {
  state = defaultState;

  onChangeText = (name, value) => {
    this.setState(state => ({
      values: {
        ...state.values,
        [name]: value,
      },
    }));
  }

  submit = async () => {
    if (this.state.isSubmitting) return;
    this.setState({ isSubmitting: true });
    let response;
    try {
      response = await this.props.mutate({
        variables: this.state.values,
      });
      console.log(response);
    } catch (err) {
      this.setState({
        errors: {
          email: 'Already taken',
        },
        isSubmitting: false,
      });
      console.log(err);
      return;
    }
    await AsyncStorage.setItem(TOKEN_KEY, response.data.signup.token);
    // this.setState(defaultState);
    this.props.history.push('/products');
  }

  goToLogin = () => {
    this.props.history.push('/');
  }

  render() {
    const { values: { name, email, password }, errors } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.secondary}>
          <TextField
            value={name}
            name="name"
            onChangeText={this.onChangeText}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TextField
            value={email}
            name="email"
            onChangeText={this.onChangeText}
          />
          <TextField
            value={password}
            name="password"
            secureTextEntry
            onChangeText={this.onChangeText}
          />
          <Button title="Create account" onPress={this.submit} />
          <Text style={{ textAlign: 'center' }}>-OR-</Text>
          <Button title="Go to login" onPress={this.goToLogin} />
        </View>
      </View>
    );
  }
}

const SIGNUP_MUTATION = gql`
  mutation ($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

export default graphql(SIGNUP_MUTATION)(Signup);
