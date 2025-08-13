//PERSPICTO-IONIC-MAPBOX\src\layout\PrivateLayout.tsx

import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { Redirect, Route , RouteProps} from "react-router-dom";

import { home, alert, document, barChart, person } from "ionicons/icons";

import Home from "../screens-private/home/Home";
import Alerts from "../screens-private/alerts/Alerts";
import Files from "../screens-private/files/Files";
import Grafics from "../screens-private/grafics/Grafics";
import Profile from "../screens-private/profile/Profile";


const PrivateLayout: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/home" component={Home} /> 
      <Route exact path="/alerts" component={Alerts} />
      <Route exact path="/files" component={Files} />
      <Route exact path="/grafics" component={Grafics} />
      <Route exact path="/profile" component={Profile} />
      <Redirect exact from="/private" to="/home" /> 
    </IonRouterOutlet>

    <IonTabBar slot="bottom">

       <IonTabButton tab="home" href="/home" aria-label="Tab de Home donde puedes buscar y guardar los datos"> 
         <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton> 
      <IonTabButton tab="alerts" href="/alerts">
        <IonIcon icon={alert} />
        <IonLabel>Alerts</IonLabel>
      </IonTabButton>
      <IonTabButton tab="grafics" href="/grafics" aria-label="Tab de graficos en base a los datos selecionados y guardos en el mapbox">
        <IonIcon icon={barChart} />
        <IonLabel>Gráficos</IonLabel>
      </IonTabButton>
      <IonTabButton tab="files" href="/files" aria-label="Tab de descarga de documentos">
        <IonIcon icon={document} />
        <IonLabel>Files</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/profile" aria-label="Tab de Perfil del usuario">
        <IonIcon icon={person} />
        <IonLabel>Perfil</IonLabel>
       </IonTabButton>
      {/*<IonTabButton tab="settings" href="/settings">
        <IonIcon icon={settings} />
        <IonLabel>Config</IonLabel>
      </IonTabButton> */}
      
    </IonTabBar>
  </IonTabs>
);

export default PrivateLayout;
