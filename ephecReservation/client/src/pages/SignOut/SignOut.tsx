import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
//importation des autres fichiers
import './SignOut.css';
import config from "../../config.json";
//hook pour check si il y a des données
import useAuthentication from "../../hooks/checkAuthentication";

const SignOut: React.FC = () => {
  //check si l'utilisateur est connecté
  useAuthentication();

  function signOut() {
    let responseBox = document.getElementById('sign_out_response_box')
    //on change le token avec un généré aléatoirement
    fetch(config.API_URL + "/auth/token", {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: (
        JSON.stringify({
          upn: localStorage.getItem('upn')
        }
        )
      ),
    }).then(function (res) {
      if (res.status === 200) {
        localStorage.clear(); // clear all data in local storage
        if (responseBox !== undefined && responseBox !== null) {
          //si la deuxième requête se passe bien
        responseBox.innerHTML = "<p id='success_response'>Vous êtes déconnecté.</p>";
        }
      }
      else{
        //si la deuxième requête se passe pas bien
        if (responseBox !== undefined && responseBox !== null) {
          responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
          }
      }

    }).catch(function (res) {
      //si la deuxième requête se passe pas bien
      if (responseBox !== undefined && responseBox !== null) {
        responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
      }
    })

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
          <div id="sign_out_response_box">
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default SignOut;
