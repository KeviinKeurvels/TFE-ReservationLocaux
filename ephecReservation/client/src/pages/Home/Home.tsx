import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';

import config from "../../config.json";

const Home: React.FC = () => {

  const history = useHistory();
  function redirectToRoom(){
    history.push("/room");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Accueil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonButton className='button_connexion' onClick={()=>redirectToRoom()}>Connexion</IonButton>


      </IonContent>
    </IonPage>
  );
};

export default Home;
