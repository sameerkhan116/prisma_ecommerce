import React from 'react';
// import { View } from 'react-native';
import { NativeRouter, Switch, Route } from 'react-router-native';

import Signup from './signup';
import Login from './login';

export default() => (
  <NativeRouter>
    <Switch>
      <Route exact path="/" component={Signup} />
      <Route exact path="/login" component={Login} />
    </Switch>
  </NativeRouter>
);

