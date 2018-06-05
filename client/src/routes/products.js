import React from 'react';
import { Text, View, Button } from 'react-native';

export default ({ history }) => (
  <View>
    <Text style={{ marginTop: 50 }}>This is the products page.</Text>
    <Button title="Add a product" onPress={() => history.push('/new-product')} />
  </View>
);

