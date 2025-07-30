import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import { usePushNotifications } from './common/hooks/usePushNotifications'; // ✅ Importa el hook

// import Tab1 from './pages/Tab1';
// import Tab2 from './pages/Tab2';
// import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './common/context/ThemeContext';
import { useFirebaseMessaging } from './common/hooks/useFirebaseMessaging'; // ✅ Importa el hook de Firebase Messaging

setupIonicReact();
const userId = 25;

const App: React.FC = () => {
  usePushNotifications();

  useFirebaseMessaging(userId);

  return (
    
    <IonApp>
      <IonReactRouter>
        <ThemeProvider>
          <AppRoutes />
      </ThemeProvider>
    </IonReactRouter>

  </IonApp>
  );
}

export default App;
