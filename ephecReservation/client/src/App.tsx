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
import { homeOutline, accessibilityOutline, logOutOutline} from 'ionicons/icons';

/*pages*/
import Room from './pages/Room/Room';
import Schedule from './pages/Schedule/Schedule';
import Home from './pages/Home/Home';
import SignOut from './pages/SignOut/SignOut';

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

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/room">
            <Room />
          </Route>
          <Route exact path="/schedule/:nameRoom">
            <Schedule />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/signOut">
            <SignOut />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="room" href="/room">
            <IonIcon icon={homeOutline} />
            <IonLabel>Locaux</IonLabel>
          </IonTabButton>

          <IonTabButton tab="signOut" href="/signOut">
            <IonIcon icon={logOutOutline} />
            <IonLabel>Déconnexion</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  
);

export default App;

/*          <IonTabButton tab="home" href="/">
            <IonIcon icon={accessibilityOutline} />
            <IonLabel>Perso</IonLabel>
          </IonTabButton>
          */
