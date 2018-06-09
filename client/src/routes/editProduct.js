import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ReactNativeFile } from 'apollo-upload-client';

import { PRODUCTS_QUERY as query } from './products';
import Form from '../components/Form';

const submit = async (values, state, history, mutate) => {
  const { pictureUrl, name, price } = values;
  let picture = null;
  if (state.pictureUrl !== pictureUrl) {
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
        id: state.id,
        name,
        price,
        picture,
      },
      update: (store, { data: { updateProduct } }) => {
        const data = store.readQuery({ query });
        data.products = data.products.map(x => (x.id === updateProduct.id ? updateProduct : x));
        store.writeQuery({ query, data });
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
    name: state.name,
    price: `${state.price}`,
    pictureUrl: `http://10.0.0.32:4000/${state.pictureUrl}`,
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
