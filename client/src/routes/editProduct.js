import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ReactNativeFile } from 'apollo-upload-client';

import { PRODUCTS_QUERY as query } from './products';
import Form from '../components/Form';

const submit = async (values, state, history, mutate) => {
  const { pictureUrl, name, price } = values;
  let picture = null;
  if (state.item.pictureUrl !== pictureUrl) {
    picture = new ReactNativeFile({
      uri: pictureUrl,
      type: 'image/png',
      name,
    });
  }
  let response;
  try {
    response = await mutate({
      variables: {
        id: state.item.id,
        name,
        price,
        picture,
      },
      update: (store, { data: { updateProduct } }) => {
        const data = store.readQuery({ query, variables: state.variables });
        data.productsConnections.edges =
          data.productsConnection.edges.map(x =>
            (x.node.id === updateProduct.id
              ? ({
                __typename: 'Node',
                cursor: updateProduct.id,
                node: updateProduct,
              })
              : x));
        store.writeQuery({ query, data, variables: state.variables });
      },
    });
  } catch (err) {
    console.log(err);
    return;
  }
  console.log(response);
  history.push('/products');
};

const EditProduct = ({ location: { state }, history, mutate }) => (
  <Form
    initialValues={{
    name: state.item.name,
    price: `${state.item.price}`,
    pictureUrl: `http://10.0.0.32:4000/${state.item.pictureUrl}`,
  }}
    submit={values => submit(values, state, history, mutate)}
    current="Edit"
  />
);

const EDIT_PRODUCT_MUTATION = gql`
  mutation($id: ID!, $name: String, $price: Float, $picture: Upload) {
    updateProduct(id: $id, name: $name, price: $price, picture: $picture) {
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

export default graphql(EDIT_PRODUCT_MUTATION)(EditProduct);
