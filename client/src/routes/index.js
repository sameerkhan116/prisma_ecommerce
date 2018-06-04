import React from 'react';
// import { View } from 'react-native';
import { NativeRouter, Switch, Route } from 'react-router-native';

import Signup from './signup';
import Login from './login';
import Products from './products';

export default() => (
  <NativeRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/products" component={Products} />
    </Switch>
  </NativeRouter>
);

