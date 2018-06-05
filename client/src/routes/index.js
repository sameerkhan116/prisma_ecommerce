import React from 'react';
// import { View } from 'react-native';
import { NativeRouter, Switch, Route } from 'react-router-native';

import Signup from './signup';
import Login from './login';
import Products from './products';
import CheckToken from './checkToken';
import NewProduct from './newProduct';

export default() => (
  <NativeRouter>
    <Switch>
      <Route exact path="/" component={CheckToken} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/new-product" component={NewProduct} />
      <Route exact path="/products" component={Products} />
    </Switch>
  </NativeRouter>
);

