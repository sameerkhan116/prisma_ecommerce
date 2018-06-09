import React, { Component } from 'react';
import { Image, Button, View, StyleSheet } from 'react-native';
import { ImagePicker } from 'expo';

import TextField from './TextField';

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
  picture: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

const defaultState = {
  values: {
    name: '',
    price: '',
    pictureUrl: '',
  },
  errors: {},
  isSubmitting: false,
};

export default class Form extends Component {
  constructor(props) {
    super(props);
    const { initialValues = {} } = props;
    this.state = {
      ...defaultState,
      values: {
        ...defaultState.values,
        ...initialValues,
      },
    };
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
    this.props.submit(this.state.values);
  }

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.onChangeText('pictureUrl', result.uri);
    }
  }

  render() {
    const { values: { name, price, pictureUrl } } = this.state;
    const { current } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.secondary}>
          <TextField
            value={name}
            name="name"
            onChangeText={this.onChangeText}
          />
          <TextField
            value={price}
            name="price"
            onChangeText={this.onChangeText}
          />
          <Button
            title="Pick an image from camera roll"
            onPress={this.pickImage}
          />
          {pictureUrl ?
            (<Image source={{ uri: pictureUrl }} style={styles.picture} />)
            : null
          }
          <Button title={`${current} Product`} onPress={this.submit} />
        </View>
      </View>
    );
  }
}
