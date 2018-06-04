import React, { Component } from 'react';
import { AsyncStorage, Text, Button, View, StyleSheet } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import TextField from './components/TextField';

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
    email: '',
    password: '',
  },
  errors: {},
  isSubmitting: false,
};

class Login extends Component {
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
    const response = await this.props.mutate({
      variables: this.state.values,
    });

    console.log(response);
    const { payload, error } = response.data.login;

    if (payload) {
      await AsyncStorage.setItem('@ecommerce/token', payload.token);
      // this.setState(defaultState);
      this.props.history.push('/products');
    } else {
      this.setState({
        errors: {
          [error.field]: error.msg,
        },
        isSubmitting: false,
      });
    }
  }

  goToSignup = () => {
    this.props.history.push('/signup');
  }

  render() {
    const { values: { email, password }, errors } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.secondary}>
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TextField
            value={email}
            name="email"
            onChangeText={this.onChangeText}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          <TextField
            value={password}
            name="password"
            secureTextEntry
            onChangeText={this.onChangeText}
          />
          <Button title="Login" onPress={this.submit} />
          <Text style={{ textAlign: 'center' }}>-OR-</Text>
          <Button title="Go to signup" onPress={this.goToSignup} />
        </View>
      </View>
    );
  }
}

const LOGIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      payload {
        token
      }
      error {
        field
        msg
      }
    }
  }
`;

export default graphql(LOGIN_MUTATION)(Login);
