import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, calendarOutline, logOutOutline, settingsOutline } from 'ionicons/icons';


/*pages*/
import Home from './pages/Home/Home';
import Registration from './pages/Registration/Registration'
import Implantation from './pages/Implantation/Implantation';
import Room from './pages/Room/Room';
import Schedule from './pages/Schedule/Schedule';
import SignOut from './pages/SignOut/SignOut';
import MyReservations from './pages/MyReservations/MyReservations';
import Administration from './pages/Administration/Administration';
import NotFound from './components/NotFound/NotFound'


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

// Set up the timeout function
let timeoutId = setTimeout(() => {
  localStorage.clear(); // clear all data in local storage
}, 1 * 60 * 1000); // 1 minute

// Reset the timeout function whenever the user interacts with the page
document.addEventListener('mousemove', () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    localStorage.clear(); // clear all data in local storage
  }, 1 * 60 * 1000); // 1 minute
});



const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
          <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/registration">
              <Registration />
            </Route>
            <Route exact path="/implantation">
              <Implantation />
            </Route>
            <Route exact path="/room/:idImplantation">
              <Room />
            </Route>
            <Route
              exact
              path="/schedule/:idRoom"
              render={({ match }) => (
                <Schedule key={match.params.idRoom} />
              )}
            />
            <Route exact path="/signOut">
              <SignOut />
            </Route>
            <Route exact path="/myReservations/:idUser">
              <MyReservations />
            </Route>
            <Route exact path="/administration">
              <Administration />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route component={NotFound} />
          </IonRouterOutlet>

          
          <IonTabBar slot="bottom" id="tabBar">
            <IonTabButton tab="implantation" href="/implantation">
              <IonIcon icon={homeOutline} />
            </IonTabButton>
            <IonTabButton tab="myReservations" href="/myReservations/1">
              <IonIcon icon={calendarOutline} />
            </IonTabButton>
            <IonTabButton className='admin_button_tab_bar' tab="administration" href="/administration">
              <IonIcon icon={settingsOutline} />
            </IonTabButton>
            <IonTabButton tab="signOut" href="/signOut">
              <IonIcon icon={logOutOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>

  )
};

export default App;