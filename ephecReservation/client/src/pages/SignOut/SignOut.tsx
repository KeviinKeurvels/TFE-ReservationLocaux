import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './SignOut.css';
//hook pour check si il y a des données
import useAuthentication from "../../hooks/checkAuthentication";

const SignOut: React.FC = () => {
  //check si l'utilisateur est connecté
  useAuthentication();

  function signOut() {
    localStorage.clear(); // clear all data in local storage

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Déconnexion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div id="sign_out">
          <p>Vous nous quittez déjà ?</p>
          <IonButton color='danger' onClick={() => signOut()}>Déconnexion</IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default SignOut;
