import {
  IonCol,
  IonDatetime, IonIcon, IonRow,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import React from 'react';
import { addOutline, refreshOutline } from 'ionicons/icons';
import {
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
} from '@ionic/react';
import { useRef } from 'react';
//importation des autres fichiers
import './Schedule.css';
import CardSchedule from '../../components/CardSchedule/CardSchedule';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json";
import { getInformationFromADate, formatDate, allFieldsChecked } from '../../functions/Schedule/Schedule';



const Schedule: React.FC = () => {
  //récupération des paramètres
  let params: any;
  params = useParams();

  //le jour d'aujourd'hui
  let currentDate = new Date();
  //l'année actuelle
  let currentYear = currentDate.getFullYear();
  //pour avoir les reservations d'un jour
  const [reservations, setReservations] = useState([]);
  const [dateChosen, setDateChosen] = useState(formatDate(currentDate));
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);

  //pour le modal d'ajout d'une réservation
  const modal = useRef<HTMLIonModalElement>(null);





  const fetchAllReservationForOneDay = async () => {
    /*
    *   Récupère les informations d'une réservation pour un jour
    */
    setIsLoading(true);
    fetch(config.API_URL + "/reservations/byRoomAndDay?day='" + dateChosen + "'&room='" + params["nameRoom"] + "'")
      .then((res) => res.json())
      .then((res) => {
        setReservations(res);
        setIsLoading(false);
      })
      .catch((err) => console.log(err))
  }


  //le useEffect de dateChosen qui fait que quand on change de date, il va re fetch
  useEffect(() => {
    fetchAllReservationForOneDay()
  }, [dateChosen]);


  function handleSubmit(event: any) {
    //cache le bouton
    let submitButton = document.getElementById("submit_button");
    if (submitButton !== undefined && submitButton !== null) {
      submitButton.style.display = "none";
    }
    //ne recharge pas la page
    event.preventDefault();
    //pour la box qui va afficher les messages lors de la réservation
    let responseBox = document.getElementById("callback_message");
    //pour la box qui où il y a le formulaire de réservation
    let formReservation = document.getElementById("form_reservation");

    //pour afficher un message en attendant
    if (responseBox !== undefined && responseBox !== null) {
      responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
    }


    if (allFieldsChecked(event.target, reservations, currentYear)) {
      //si tous les champs respectent bien ce qu'il faut

      fetch(config.API_URL + "/reservations", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: (
          JSON.stringify({
            title: event.target.nameReservation.value,
            day: event.target.day.value,
            hourBegin: event.target.hourBegin.value,
            hourEnd: event.target.hourEnd.value,
            idTe: 1,
            nameRoom: params["nameRoom"],
          }
          )
        ),
      }).then(function (res) {
        if (responseBox !== undefined && responseBox !== null) {
          if (res.status === 200) {
            if (formReservation !== undefined && formReservation !== null) {
              formReservation.innerHTML = "";
            }

            responseBox.innerHTML = "<p id='success_response'>Votre réservation a bien été enregistrée.</p>";
            fetchAllReservationForOneDay()

          }
          else {

            responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";

          }

        }
      })
        .catch(function (res) {
          if (responseBox !== undefined && responseBox !== null) {
            responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
          }
        })
    }
    else {
      if (submitButton !== undefined && submitButton !== null) {
        submitButton.style.display = "block";
      }
    }




  }







  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Horaire {params["nameRoom"]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ModalLoading isLoading={isLoading} />
        <h1 id="title_schedule">Choisissez un jour</h1>
        <IonItem>
          <IonDatetime
            presentation="date"
            value={dateChosen}
            min={String(currentYear)}
            max={String(currentYear + 2)}
            onIonChange={(e) => getInformationFromADate(e.target.value, setDateChosen, currentYear)}
          >
          </IonDatetime>
        </IonItem>
        <IonRow>
          <IonCol>
            <h1 id="title_schedule">Réservations</h1>
          </IonCol>
          <IonCol>
            <IonButton fill="outline" className='reservation_top_button' onClick={() => fetchAllReservationForOneDay()}><IonIcon icon={refreshOutline} /></IonButton>
          </IonCol>
          <IonCol>
            <IonButton fill="outline" id='open-modal' color='success' className='reservation_top_button'><IonIcon icon={addOutline} />Ajouter</IonButton>
          </IonCol>
        </IonRow>

        <IonModal id="example-modal" ref={modal} trigger="open-modal">
          <IonContent>
            <IonToolbar color="warning">
              <IonTitle>Réservation {params["nameRoom"]}</IonTitle>
            </IonToolbar>
            <div id="formReservation">
              <form onSubmit={handleSubmit}>
                <label htmlFor="day">Jour de la réservation:</label>
                <input type="date" id="day" name="day" value={dateChosen} onChange={(e) => getInformationFromADate(e.target.value, setDateChosen, currentYear)} min={String(currentYear)} max={String(currentYear + 2)} required /><br />

                <table>
                  <tbody>
                    <tr><td><label htmlFor="hour_begin" className='hour_begin_field'>Début:</label></td><td><label htmlFor="hour_end" className='hour_end_field'>Fin:</label></td></tr>
                    <tr>
                      <td><input type="time" id="hour_begin" name="hourBegin" required className='hour_begin_field' min="08:00" max="18:00"></input></td>
                      <td><input type="time" id="hour_end" className='hour_end_field' name="hourEnd" placeholder='10:30' required min="08:00" max="18:00"></input></td>
                    </tr>
                  </tbody>
                </table>
                <p id="message_schedule">Les horaires vont de 8:00 à 18:00</p>
                <br />
                <label htmlFor="name_reservation">Intitulé de la réservation:</label>
                <input type="text" id="name_reservation" name="nameReservation" required></input><br />
                <input id="submit_button" type="submit" value="Réserver" />
              </form>
            </div>
            <div id="callback_message">
            </div>
          </IonContent>
        </IonModal>


        <IonItem>
          <CardSchedule Reservations={reservations} NameRoom={params["nameRoom"]} fetchAllReservationForOneDay={fetchAllReservationForOneDay} />
        </IonItem>


      </IonContent>


    </IonPage>


  );
};

export default Schedule;
