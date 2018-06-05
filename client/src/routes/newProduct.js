import React, { Component } from 'react';
import { Button, View, StyleSheet, Image } from 'react-native';
import { ImagePicker } from 'expo';

import TextField from '../components/TextField';

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

class NewProduct extends Component {
  state = defaultState;

  onChangeText = (name, value) => {
    this.setState(state => ({
      values: {
        ...state.values,
        [name]: value,
      },
    }));
  }

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({
        values: {
          pictureUrl: result.uri,
        },
      });
    }
  }

  submit = async () => {
    if (this.state.isSubmitting) return;
    this.setState({ isSubmitting: true });
    let response;
    try {
      response = await this.props.mutate({
        variables: this.state.values,
      });
    } catch (err) {
      console.log(err);
    }
    console.log(response);
    this.props.history.push('/products');
  }

  render() {
    const { values: { name, price, pictureUrl } } = this.state;
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
          <Button title="Add Product" onPress={this.submit} />
        </View>
      </View>
    );
  }
}

export default NewProduct;
