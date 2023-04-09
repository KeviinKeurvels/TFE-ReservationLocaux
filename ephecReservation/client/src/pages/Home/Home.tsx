import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLabel, IonButton, IonItem } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

//importation des autres fichiers
import "./Home.css"
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json"
import { allFieldsChecked } from '../../functions/Login/Login'


const Home: React.FC = () => {
  // Affiche le UPN de l'utilisateur
  const [upn, setUpn] = useState('py.gousenbourger@ephec.be');
  const [password, setPassword] = useState("MyPassword1234");
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  async function handleLogin(event: any) {
    event.preventDefault();
    setIsLoading(true);
    if (allFieldsChecked(upn, password)) {
      try {
        const response = await fetch(config.API_URL + '/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            upn: upn,
            password: password
          })
        });
        if (response.status === 200) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('upn', data.upn);
          history.push("/implantation");
          let tabBar = document.getElementById("tabBar");
          if (tabBar !== null && tabBar !== undefined) {
            tabBar.style.display = "flex";
          }
          if(data.isAdmin){
            const adminTabButton = document.querySelector(".admin_button_tab_bar") as HTMLElement;
            adminTabButton.style.display = "flex";
          }
        } else {
          let responseBox = document.getElementById("callback_message_login");
          if (responseBox !== undefined && responseBox !== null) {
            responseBox.innerHTML = "<p id='failed_response'>Identifiant ou mot de passe incorrect</p>";
          };
        }
      }
      catch (err) {
        let responseBox = document.getElementById("callback_message_login");
        if (responseBox !== undefined && responseBox !== null) {
          responseBox.innerHTML = "<p id='failed_response'>Problème interne.</p>";
        };
      }



    }

    setIsLoading(false);
  }



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Accueil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ModalLoading isLoading={isLoading} />
        <form onSubmit={handleLogin}>
          <IonItem>
            <IonLabel position="floating">E-mail:</IonLabel>
            <IonInput type="email" value={upn} onIonChange={e => setUpn(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Mot de passe:</IonLabel>
            <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
          </IonItem>
          <IonButton fill="outline" color="warning" type="submit" className="button_connexion">Connexion</IonButton>
        </form>
        <div id="callback_message_login"></div>
        <div id="inscription_box">
          <p>Pas de compte ? Créez-vous en un !</p>
          <IonButton fill="outline" color="success" href='/registration'>Inscription</IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Home;
