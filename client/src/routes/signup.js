import React, { Component } from 'react';
import { Button, View, TextInput, StyleSheet } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  field: {
    fontSize: 15,
    marginBottom: 15,
    height: 35,
  },
  secondary: {
    width: 300,
  },
});

class Signup extends Component {
  state = {
    values: {
      name: '',
      email: '',
      password: '',
    },
    errors: {},
    isSubmitting: false,
  }

  onChangeText = (name, value) => {
    this.setState(state => ({
      values: {
        ...state.values,
        [name]: value,
      },
    }));
  }

  submit = async () => {
    if(this.state.isSubmitting) return;
    this.setState({ isSubmitting: true });
    const response = await this.props.mutate({
      variables: this.state.values,
    });
    console.log(response);
    this.setState({ isSubmitting: false });
  }

  render() {
    const { values: { name, email, password } } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.secondary}>
          <TextInput
            value={name}
            style={styles.field}
            placeholder="Name"
            onChangeText={text => this.onChangeText('name', text)}
          />
          <TextInput
            value={email}
            style={styles.field}
            placeholder="Email"
            onChangeText={text => this.onChangeText('email', text)}
          />
          <TextInput
            value={password}
            style={styles.field}
            placeholder="Password"
            secureTextEntry
            onChangeText={text => this.onChangeText('password', text)}
          />
          <Button title="Create account" onPress={this.submit} />
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
