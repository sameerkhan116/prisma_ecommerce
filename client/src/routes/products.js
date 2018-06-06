import React from 'react';
import { Text, View, Button, FlatList, Image, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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
});

const Products = ({ data: { products }, loading, history }) => {
  if (loading || !products) return null;
  console.log(products[0]);
  return (
    <View style={styles.container}>
      <Button title="Add a product" onPress={() => history.push('/new-product')} />
      <FlatList
        data={products.map(p => ({ ...p, key: p.id }))}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image
              style={styles.images}
              source={{ uri: `http://10.0.0.32:4000/${item.pictureUrl}` }}
            />
            <View style={styles.right}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          </View>
      )}
      />
    </View>
  );
};

const PRODUCTS_QUERY = gql`
  {
    products {
      id
      price
      pictureUrl
      name
    }
  }
`;

export default graphql(PRODUCTS_QUERY)(Products);
