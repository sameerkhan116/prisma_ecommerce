import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage, FlatList, Image, StyleSheet } from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import decode from 'jwt-decode';

import { TOKEN_KEY } from '../constants';

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  },
  images: {
    height: 80,
    width: 80,
    marginLeft: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
  },
  right: {
    flex: 1,
    marginRight: 20,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
  },
  edit: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export const PRODUCTS_QUERY = gql`
  query {
    products {
      id
      price
      pictureUrl
      name
      seller {
        id
      }
    }
  }
`;

class Products extends Component {
  state = {
    userId: null,
  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const { userId } = decode(token);
    this.setState({
      userId,
    });
  }

  deleteProduct = async (id) => {
    const deleteResponse = await this.props.mutate({
      variables: {
        id,
      },
      update: (store) => {
        const data = store.readQuery({ query: PRODUCTS_QUERY });
        data.products = data.products.filter(x => x.id !== id);
        store.writeQuery({ query: PRODUCTS_QUERY, data });
      },
    });
    console.log(deleteResponse);
  }

  editProduct = (item) => {
    this.props.history.push({
      pathname: '/edit-product',
      state: item,
    });
  }

  render() {
    const { data: { products }, loading, history } = this.props;
    const { userId } = this.state;
    if (loading || !products) return null;

    return (
      <View style={styles.container}>
        <Button title="Add a product" onPress={() => history.push('/new-product')} />
        <FlatList
          keyExtractor={item => item.id}
          data={products.map(x => ({ ...x, showButtons: userId === x.seller.id }))}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Image
                style={styles.images}
                source={{ uri: `http://10.0.0.32:4000/${item.pictureUrl}` }}
              />
              <View style={styles.right}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price}</Text>
                {item.showButtons && (
                  <View style={styles.edit}>
                    <Button title="Edit" onPress={() => this.editProduct(item)} />
                    <Button title="Delete" onPress={() => this.deleteProduct(item.id)} />
                  </View>
                )}
              </View>
            </View>
        )}
        />
      </View>
    );
  }
}

const DELETE_PRODUCT = gql`
  mutation($id: ID!) {
    deleteProduct(where: {id: $id}) {
      id
    }
  }
`;

const graphqlComponent = compose(
  graphql(PRODUCTS_QUERY),
  graphql(DELETE_PRODUCT),
)(Products);

export default graphqlComponent;
