import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLabel, IonButton, IonItem } from '@ionic/react';
import { useState } from 'react';
import bcrypt from 'bcryptjs';

//importation des autres fichiers
import "./Registration.css"
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json"
import { allFieldsChecked } from '../../functions/Registration/Registration'


const Regisration: React.FC = () => {
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegistration(event: any) {
    event.preventDefault();
    let form = event.target;
    setIsLoading(true);
    let formRegistration = document.getElementById("form_registration");
    let responseBox = document.getElementById("callback_message_registration");
    let registration_button = document.getElementById("registration_button");
    let buttonReturn = document.getElementById("return_menu");
    if (registration_button !== undefined && registration_button !== null) {
      registration_button.style.display = "none";
    };
    if (await allFieldsChecked(form)) {
      const password = form.password1.value;
      const saltRounds = 10;
      try {
        const passwordHashed = await new Promise<string>((resolve, reject) => {
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              if (err) reject(err);
              resolve(hash);
            });
          });
        });
        console.log(passwordHashed);
  
        const response = await fetch(config.API_URL + '/auth/registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: form.name.value,
            upn: form.upn.value,
            password: passwordHashed
          })
        });
        if (response.status == 200) {
          if (formRegistration !== undefined && formRegistration !== null) {
            formRegistration.innerHTML = "";
          };
          if (responseBox !== undefined && responseBox !== null && buttonReturn !== undefined && buttonReturn !== null) {
            responseBox.innerHTML = `<p id='success_response'>Vous êtes inscrit !</p><br />`;
            buttonReturn.style.display = "block";
          };
        }
        else {
          if (registration_button !== undefined && registration_button !== null) {
            registration_button.style.display = "block";
          };
        }
      }
      catch (err) {
        if (responseBox !== undefined && responseBox !== null) {
          responseBox.innerHTML = "<p id='failed_response'>Problème interne.</p>";
        };
      }
    }
    else {
      if (registration_button !== undefined && registration_button !== null) {
        registration_button.style.display = "block";
      };
    }
  
    setIsLoading(false);
  }
  



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Inscription</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ModalLoading isLoading={isLoading} />
        <form onSubmit={handleRegistration} id='form_registration'>
          <IonItem>
            <IonLabel position="floating">Nom d'utilisateur</IonLabel>
            <IonInput type="text" min="2" max="100" name='name' required></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">E-mail</IonLabel>
            <IonInput type="email" min="3" max="100" name='upn' required></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Mot de passe</IonLabel>
            <IonInput type="password" name='password1' min="5" max="20" required></IonInput>
          </IonItem>
          <p id="password_policy">Le mot de passe doit, au minimum, avoir: <br /> 8 caractères<br />1 minuscule<br />1 majuscule<br /> 1 chiffre<br />un caractère alpha non numériques</p>
          <IonItem>
            <IonLabel position="floating">Confirmer le mot de passe</IonLabel>
            <IonInput type="password" name='password2' min="8" max="20" required></IonInput>
          </IonItem>
          <IonButton id='registration_button' color="success" fill='outline' type="submit">S'inscrire</IonButton>
        </form>
        <div id="callback_message_registration"></div>
        <IonButton id="return_menu" color='success' href='/home'>Retourner au menu</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Regisration;
