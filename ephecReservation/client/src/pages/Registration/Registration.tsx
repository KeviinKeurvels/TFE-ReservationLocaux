import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLabel, IonButton, IonItem } from '@ionic/react';
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from 'react';
//importation des autres fichiers
import "./Registration.css"
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json"
import { allFieldsChecked } from '../../functions/Registration/Registration'


const Regisration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const captchaRef = useRef<ReCAPTCHA | null>(null);

  async function handleRegistration(event: any) {
    event.preventDefault();
    if (captchaRef.current !== null) {
      const token = captchaRef.current.getValue();
      captchaRef.current.reset(); // Reset the ReCAPTCHA component
      let form = event.target;
      setIsLoading(true);
      let formRegistration = document.getElementById('form_registration');
      let responseBox = document.getElementById('callback_message_registration');
      let registration_button = document.getElementById('registration_button');
      let buttonReturn = document.getElementById('return_menu');

      if (registration_button !== undefined && registration_button !== null) {
        registration_button.style.display = 'none';
      }

      let codeIsGood = false;
      try {
        const isMatch = await new Promise<boolean>((resolve, reject) => {
          bcrypt.compare(form.fixed_password.value, '$2y$10$g69MNZx6a/jrQKc3qb1e/eDRh4R8KSrUR1Tv7LtCcDCXP5cK0kH2u', (error, isMatch) => {
            if (error) {
              reject(error);
            } else {
              resolve(isMatch);
            }
          });
        });

        if (!isMatch) {
          // If the activation code is incorrect
          if (responseBox !== undefined && responseBox !== null) {
            responseBox.innerHTML =
              "<p id='failed_response'>Le code d'activation n'est pas le bon.<br />Si vous ne connaissez pas le code, demandez à un administrateur.</p>";
          }
        } else {
          // If the activation code is correct
          codeIsGood = true;
        }
      } catch (error) {
        // If there is an error during the comparison
        if (responseBox !== undefined && responseBox !== null) {
          responseBox.innerHTML = "<p id='failed_response'>Problème interne.</p>";
        }
      }

      if (await allFieldsChecked(form) && codeIsGood) {
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
          const response = await fetch(config.API_URL + '/auth/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: form.name.value,
              upn: form.upn.value,
              password: passwordHashed,
              recaptchaResponse: token, // Pass the reCAPTCHA token to the server
            }),
          });

          if (response.status === 200) {
            if (formRegistration !== undefined && formRegistration !== null) {
              formRegistration.innerHTML = '';
            }
            if (responseBox !== undefined && responseBox !== null && buttonReturn !== undefined && buttonReturn !== null) {
              responseBox.innerHTML = `<p id='success_response'>Vous êtes inscrit !</p><br />`;
              buttonReturn.style.display = 'block';
            }
          } else {
            if (response.status === 400) {
              if (responseBox !== undefined && responseBox !== null) {
                responseBox.innerHTML = "<p id='failed_response'>Le captcha n'a pas été validé.</p>";
              };
              if (registration_button !== undefined && registration_button !== null) {
                registration_button.style.display = 'block';
              }
            }
            else {
              if (responseBox !== undefined && responseBox !== null) {
                responseBox.innerHTML = "<p id='failed_response'>Erreur interne.</p>";
              };
              if (registration_button !== undefined && registration_button !== null) {
                registration_button.style.display = 'block';
              }
            }
          }
        } catch (err) {
          if (responseBox !== undefined && responseBox !== null) {
            responseBox.innerHTML = "<p id='failed_response'>Problème interne.</p>";
          }
        }
      } else {
        if (registration_button !== undefined && registration_button !== null) {
          registration_button.style.display = 'block';
        }
      }
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
        <IonButton id="return_menu" color='warning' fill='outline' href='/home'>Retourner au menu</IonButton>

        <form onSubmit={handleRegistration} id='form_registration'>
          <IonItem>
            <IonLabel position="floating">Code d'inscription</IonLabel>
            <IonInput type="password" min="2" max="10" name='fixed_password' required></IonInput>
          </IonItem>
          <p id="password_policy">Ceci est le code qui vous est donné par l'EPHEC pour vous permettre de vous inscrire sur l'application</p>
          <IonItem>
            <IonLabel position="floating">Nom d'utilisateur</IonLabel>
            <IonInput type="text" min="2" max="100" name='name' required value={"eeeeeee"}></IonInput>
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
            <IonLabel position="floating" >Confirmer le mot de passe</IonLabel>
            <IonInput type="password" name='password2' min="8" max="20" required></IonInput>
          </IonItem>
          <br />
          <ReCAPTCHA sitekey={"6LeKvCgmAAAAAPzzuJf8tuTs5t3yRC2R03PVr36w"} ref={captchaRef} className='captcha' />
          <div id="callback_message_registration"></div>
          <IonButton id='registration_button' color="success" fill='outline' type="submit">S'inscrire</IonButton>
        </form>

      </IonContent>
    </IonPage>
  );
};

export default Regisration;
