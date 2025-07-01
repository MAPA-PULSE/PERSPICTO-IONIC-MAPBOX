import { Switch, Route } from "react-router-dom";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Register from "../pages/Register";
// import Home from "../screens/Home";
// import Tab1 from "../screens/Tab1";
// import Tab2 from "../screens/Tab2";
// import Tab3 from "../screens/Tab3";
// import Tab4 from "../screens/Tab4";
// import Tab5 from "../screens/Tab5";
// import PrivateRoute from "../components/PrivateRoute";

const AppRoutes = () => (
  <Switch>
    <Route exact path="/pages" component={Welcome} />
    <Route path="/pages/login" component={Login} />
    <Route path="/pages/register" component={Register} />
  
     {/* protegidas */}
    {/* <PrivateRoute path="/home" component={Home} />
    <PrivateRoute path="/tab1" component={Tab1} />
    <PrivateRoute path="/tab2" component={Tab2} />
    <PrivateRoute path="/tab3" component={Tab3} />
    <PrivateRoute path="/tab4" component={Tab4} />
    <PrivateRoute path="/tab5" component={Tab5} /> */}
  
  </Switch>


    
);


export default AppRoutes;
