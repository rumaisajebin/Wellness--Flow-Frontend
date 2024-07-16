import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import LandingHome from '../pages/auth/LandingHome';
import SignUp from '../pages/auth/SignUp';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingHome} />
        <Route exact path="/signup" component={SignUp} />
        {/* <Redirect to="/" /> */}
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
