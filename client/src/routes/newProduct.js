import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ReactNativeFile } from 'apollo-upload-client';

import { PRODUCTS_QUERY as query } from './products';
import Form from '../components/Form';

const submit = async (values, mutate, history) => {
  const { pictureUrl, name, price } = values;
  const picture = new ReactNativeFile({
    uri: pictureUrl,
    type: 'image/png',
    name,
  });
  let response;
  try {
    response = await mutate({
      variables: {
        name,
        price,
        picture,
      },
      update: (store, { data: { createProduct } }) => {
        const data = store.readQuery({ query });
        data.products.push(createProduct);
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

const NewProduct = ({ mutate, history }) => <Form current="Add" submit={values => submit(values, mutate, history)} />;

const CREATE_PRODUCT_MUTATION = gql`
  mutation($name: String!, $price: Float!, $picture: Upload!) {
    createProduct(name: $name, price: $price, picture: $picture) {
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

export default graphql(CREATE_PRODUCT_MUTATION)(NewProduct);
