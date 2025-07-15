import React from "react";
import { Switch, Route } from "react-router-dom";

import Welcome from "../pages-public/welcome/Welcome";
import Login from "../pages-public/login/Login";
import Register from "../pages-public/register/Register";

import PrivateRoute from "../layout/PrivateRoute";
import PrivateLayout from "../layout/PrivateLayout";

const AppRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <PrivateRoute path="/" component={PrivateLayout} />

 </Switch>
);

export default AppRoutes;
