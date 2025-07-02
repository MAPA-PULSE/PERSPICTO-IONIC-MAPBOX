import React from "react";
import { Switch, Route } from "react-router-dom";

import Welcome from "../pages/welcome/Welcome";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";

import Home from "../screens/home/Home";
import Alerts from "../screens/alerts/Alerts";
import Files from "../screens/files/Files";
import Grafics from "../screens/grafics/Grafics";
import Profile from "../screens/profile/Profile";
import Settings from "../screens/settings/Settings";

import PrivateRoute from "../components/PrivateRoute";

const AppRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />

    <PrivateRoute exact path="/home" component={Home} />
    <PrivateRoute exact path="/alerts" component={Alerts} />
    <PrivateRoute exact path="/files" component={Files} />
    <PrivateRoute exact path="/grafics" component={Grafics} />
    <PrivateRoute exact path="/profile" component={Profile} />
    <PrivateRoute exact path="/settings" component={Settings} />
  </Switch>
);

export default AppRoutes;
