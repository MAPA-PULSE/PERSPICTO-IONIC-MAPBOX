import React from "react";
import { Switch, Route } from "react-router-dom";

import Welcome from "../pages/welcome/Welcome";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";

import PrivateRoute from "../components/PrivateRoute";
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
