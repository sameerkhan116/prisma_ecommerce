import React, { Component } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  Button,
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import decode from 'jwt-decode';

import { TOKEN_KEY } from '../constants';
import TextField from '../components/TextField';

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    display: 'flex',
    flex: 1,
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
  sortRow: {
    flexDirection: 'row',
    display: 'flex',
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const PRODUCTS_QUERY = gql`
  query($after: String, $orderBy: ProductOrderByInput, $where: ProductWhereInput) {
    productsConnection(after: $after, first: 5, orderBy: $orderBy, where: $where) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          price
          pictureUrl
          name
          seller {
            id
          }
        }
      }
    }
  }
`;

const PRODUCTS_SUBSCRIPTION = gql`
  subscription {
    product(where: {
      mutation_in: UPDATED
    }) {
      __typename
      id
      name
      price
      pictureUrl
      seller {
        id
      }
    }
  }
`;

class Products extends Component {
  state = {
    userId: null,
    query: '',
  }

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const { userId } = decode(token);
    this.setState({ userId });
    this.props.data.subscribeToMore({
      document: PRODUCTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        const { node } = subscriptionData.data.product;
        // eslint-disable-next-line no-param-reassign
        prev.productConnection.edges = prev.productsConnection.edges
          .map(x => (x.node.id === node.id
            ? {
              cursor: node.id,
              node,
              __typename: 'Node',
            }
            : x
          ));
        return prev;
      },
    });
  }

  onChangeText = (name, text) => {
    this.setState({ query: text });
    this
      .props
      .data
      .refetch({
        where: {
          name_contains: text,
        },
        after: null,
      });
  }

  deleteProduct = async (id, variables) => {
    const deleteResponse = await this
      .props
      .mutate({
        variables: {
          id,
        },
        update: (store) => {
          const data = store.readQuery({ query: PRODUCTS_QUERY, variables });
          data.productsConnection.edges = data
            .productsConnection
            .edges
            .filter(x => x.node.id !== id);
          store.writeQuery({ query: PRODUCTS_QUERY, data, variables });
        },
      });
    console.log(deleteResponse);
  }

  editProduct = (item, variables) => {
    this
      .props
      .history
      .push({ pathname: '/edit-product', state: item, variables });
  }

  render() {
    const {
      data: {
        productsConnection,
        refetch,
        variables,
        fetchMore,
      },
      loading,
      history,
      updatePrice,
    } = this.props;
    const { userId } = this.state;
    if (loading || !productsConnection) { return null; }
    console.log(productsConnection);
    return (
      <View style={styles.container}>
        <View>
          <TextField
            name="Search"
            onChangeText={this.onChangeText}
            value={this.state.query}
          />
          <View style={styles.sortRow}>
            <Button
              title="Name"
              onPress={() => !loading && refetch({
              orderBy: variables.orderBy === 'name_ASC'
                ? 'name_DESC'
                : 'name_ASC',
              after: null,
            })}
            />
            <Button
              title="Price"
              onPress={() => !loading && refetch({
              orderBy: variables.orderBy === 'price_ASC'
                ? 'price_DESC'
                : 'price_ASC',
              after: null,
            })}
            />
          </View>
        </View>
        <Button
          title="Add a product"
          onPress={() => history.push({ pathname: '/new-product', state: variables })}
        />
        <FlatList
          ListFooterComponent={() => productsConnection.pageInfo.hasNextPage && <ActivityIndicator size="large" color="#0000ff" />}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0}
          onEndReached={() => {
          if (!loading && productsConnection.pageInfo.hasNextPage) {
            fetchMore({
              variables: {
                after: productsConnection.pageInfo.endCursor,
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) { return previousResult; }
                if (!previousResult
                      || !previousResult.productsConnection
                      || !previousResult.productsConnection.edges) {
                  return fetchMoreResult;
                }
                return {
                  productsConnection: {
                    __typename: 'ProductsConnection',
                    pageInfo: fetchMoreResult.productsConnections.pageInfo,
                    edges: [
                      ...previousResult.productsConnections.edges,
                      ...fetchMoreResult.productsConnections.edges,
                    ],
                  },
                };
              },
            });
          } else { this.calledOnce = true; }
          }}
          data={productsConnection
          .edges
          .map(x => ({
            ...x.node,
            showButtons: userId === x.node.seller.id,
          }))}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Image
                style={styles.images}
                source={{
              uri: `http://10.0.0.32:4000/${item.pictureUrl}`,
            }}
              />
              <View style={styles.right}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={() => updatePrice({
                  variables: {
                    id: item.id,
                    price: item.price + 5,
                  },
                })}
                >
                  <Text style={styles.price}>${item.price}</Text>
                </TouchableOpacity>
                {item.showButtons && (
                <View style={styles.edit}>
                  <Button title="Edit" onPress={() => this.editProduct(item, variables)} />
                  <Button title="Delete" onPress={() => this.deleteProduct(item.id, variables)} />
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

const UPDATE_PRODUCT_PRICE_MUTATION = gql`
  mutation($id: ID!, $price: Float) {
    updateProduct(id: $id, price: $price) {
      __typename
      id
      name
      price
      pictureUrl
      seller {
        id
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation($id: ID!) {
    deleteProduct(where: {id: $id}) {
      id
    }
  }
`;

const graphqlComponent = compose(
  graphql(PRODUCTS_QUERY, {
    options: {
      variables: {
        orderBy: 'createdAt_DESC',
      },
    },
  }),
  graphql(DELETE_PRODUCT),
  graphql(UPDATE_PRODUCT_PRICE_MUTATION, {
    name: 'updatePrice',
  }),
)(Products);

export default graphqlComponent;
