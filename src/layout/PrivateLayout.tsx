import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";

import { home, alert, document, barChart, person, settings } from "ionicons/icons";

import Home from "../screens/home/Home";
import Alerts from "../screens/alerts/Alerts";
import Files from "../screens/files/Files";
import Grafics from "../screens/grafics/Grafics";
import Profile from "../screens/profile/Profile";
import Settings from "../screens/settings/Settings";

const PrivateLayout: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/home" component={Home} />
      <Route exact path="/alerts" component={Alerts} />
      <Route exact path="/files" component={Files} />
      <Route exact path="/grafics" component={Grafics} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/settings" component={Settings} />
      <Redirect exact from="/private" to="/home" />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/home">
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="alerts" href="/alerts">
        <IonIcon icon={alert} />
        <IonLabel>Alerts</IonLabel>
      </IonTabButton>
      <IonTabButton tab="grafics" href="/grafics">
        <IonIcon icon={barChart} />
        <IonLabel>Gráficos</IonLabel>
      </IonTabButton>
      <IonTabButton tab="files" href="/files">
        <IonIcon icon={document} />
        <IonLabel>Files</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/profile">
        <IonIcon icon={person} />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" href="/settings">
        <IonIcon icon={settings} />
        <IonLabel>Config</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default PrivateLayout;
