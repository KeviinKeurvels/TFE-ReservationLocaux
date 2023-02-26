import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './SignOut.css';

import config from "../../config.json";

const SignOut: React.FC = () => {

  const history = useHistory();
  function redirectToRoom(){
    history.push("/");
  }


  function SignOut (){
    //code pour déconnexion 
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Déconnexion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

      </IonContent>
    </IonPage>
  );
};

export default SignOut;
