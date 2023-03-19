import {
  IonDatetime, IonIcon, IonRow,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import React from 'react';
import { addOutline } from 'ionicons/icons';
import {
  IonButtons,
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
import CardReservation from '../../components/CardSchedule/CardReservation';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json";




const Schedule: React.FC = () => {
  //récupération des paramètres
  let params: any;
  params = useParams();

  // pour voir quand une réservation a été ajoutée
  let reservationAdded = false;

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
  function dismiss() {
    //va reload la page pour actualiser les réservations
    if (reservationAdded) {
      fetchAllReservationForOneDay();
    }
    modal.current?.dismiss();

  }




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


  function getInformationFromADate(date: any) {
    //si la date est bien du bon format et bon compris dans la range d'année
    if ([currentYear, currentYear + 1, currentYear + 2].includes(new Date(date).getFullYear())) {
      let goodFormatDate = formatDate(date);
      setDateChosen(goodFormatDate);
    }
    else {//si mauvaise date
      return -1;
    }

  }


  function formatDate(date: any) {
    //pour avoir la date dans le bon format pour la DB
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  function checkIfThereIsAlreadyAReservation(hourBegin: any, hourEnd: any) {
    //cette fonction va regarder s'il y a déjà une réservation à ce moment-là
    let alreadyReserved = false;
    reservations.forEach((reservation) => {
      // les heures de la réservation existante 
      //on ajout et enleve 60000 afin de pouvoir réserver à la minute où l'autre a fini (et vice versa)
      var x = new Date(dateChosen + " " + reservation["hourBegin"]).getTime() + 60000;
      var y = new Date(dateChosen + " " + reservation["hourEnd"]).getTime() - 60000;

      // les heures de la nouvelle réservation
      var a = new Date(dateChosen + " " + hourBegin).getTime();
      var b = new Date(dateChosen + " " + hourEnd).getTime();

      if (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) {
        //si il y a déjà une réservation à ce moment-là
        alreadyReserved = true;
      }
    })
    return alreadyReserved;

  }

  function allFieldsChecked(form: any) {
    //cette fonction va regarder si tous les champs sont conformes
    //pour la box qui va afficher les messages lors de la réservation
    let responseBox = document.getElementById("callbackMessage");

    //variable qui va contenir le message d'erreur
    let problem = undefined;
    if (form.day.value < currentYear || form.day.value > currentYear + 2) {
      problem = "La date sélectionnée n'est pas bonne";
    }
    else if(form.day.value === "" ||form.hourBegin.value === "" ||form.hourEnd.value === ""){
      problem = "Un ou plusieurs champs sont vides";
    }
    else if (form.nameReservation.value.length < 2 || form.nameReservation.value.length > 40) {
      problem = "L'intitulé n'est pas de taille acceptable (entre 2-40 caractères)";
    }
    else if (form.hourBegin.value > "18:00" || form.hourBegin.value < "08:00") {
      problem = "L'heure de début n'est pas comprise dans les heures d'ouverture du local";
    }
    else if (form.hourEnd.value > "18:00" || form.hourEnd.value < "08:00") {
      problem = "L'heure de fin n'est pas comprise dans les heures d'ouverture du local";
    }
    else if (form.hourBegin.value > form.hourEnd.value) {
      problem = "L'heure de fin ne peut pas être avant l'heure de début";
    }
    else if (form.hourBegin.value === form.hourEnd.value) {
      problem = "L'heure de début ne peut pas être égale à l'heure de fin";
    }
    //si déjà une réservation à ce moment-là
    else if (checkIfThereIsAlreadyAReservation(form.hourBegin.value, form.hourEnd.value)) {
      problem = "Il y a déjà une réservation à ce moment-là.";
    }

    if (problem !== undefined) {
      if (responseBox !== undefined && responseBox !== null) {
        responseBox.innerHTML = "<p id='failed_response'>" + problem + "</p>";
      }
      return false;
    }
    return true;

  }

  function handleSubmit(event: any) {
    //cache le bouton
    let submitButton = document.getElementById("submit_button");
    if (submitButton !== undefined && submitButton !== null) {
      submitButton.style.display = "none";
    }
    //ne recharge pas la page
    event.preventDefault();
    //pour la box qui va afficher les messages lors de la réservation
    let responseBox = document.getElementById("callbackMessage");
    //pour la box qui où il y a le formulaire de réservation
    let formReservation = document.getElementById("formReservation");

    //pour afficher un message en attendant
    if (responseBox !== undefined && responseBox !== null) {
      responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
    }


    if (allFieldsChecked(event.target)) {
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
            reservationAdded = true;
            if (formReservation !== undefined && formReservation !== null) {
              formReservation.innerHTML = "";
            }

            responseBox.innerHTML = "<p id='success_response'>Votre réservation a bien été enregistrée.</p>";

          }
          else {
            reservationAdded = false;

            responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";

          }

        }
      })
        .catch(function (res) {
          reservationAdded = false;
          if (responseBox !== undefined && responseBox !== null) {
            responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
          }
        })
    }
    else{
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
            onIonChange={(e) => getInformationFromADate(e.target.value)}
          >
          </IonDatetime>
        </IonItem>
        <IonRow>
          <h1 id="title_schedule">Réservations</h1>
          <IonButton fill="outline" id='open-modal' className='add_button'><IonIcon icon={addOutline} />Ajouter</IonButton>
        </IonRow>

        <IonModal id="example-modal" ref={modal} trigger="open-modal">
          <IonContent>
            <IonToolbar color="warning">
              <IonTitle>Réservation {params["nameRoom"]}</IonTitle>
              <IonButtons slot="end">
                <IonButton color="light" onClick={() => dismiss()}>
                  Fermer
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <div id="formReservation">
              <form onSubmit={handleSubmit}>
                <label htmlFor="day">Jour de la réservation:</label>
                <input type="date" id="day" name="day" value={dateChosen} onChange={(e) => getInformationFromADate(e.target.value)} min={String(currentYear)} max={String(currentYear + 2)} required /><br />

                <table>
                  <tbody>
                    <tr><td><label htmlFor="hourBegin" className='hour_begin_field'>Début:</label></td><td><label htmlFor="hourEnd" className='hour_end_field'>Fin:</label></td></tr>
                    <tr>
                      <td><input type="time" id="hourBegin" name="hourBegin" required className='hour_begin_field' min="08:00" max="18:00"></input></td>
                      <td><input type="time" id="hourEnd" className='hour_end_field' name="hourEnd" placeholder='10:30' required min="08:00" max="18:00"></input></td>
                    </tr>
                  </tbody>
                </table>
                <p id="message_schedule">Les horaires vont de 8:00 à 18:00</p>
                <br />
                <label htmlFor="nameReservation">Intitulé de la réservation:</label>
                <input type="text" id="nameReservation" name="nameReservation" required></input><br />
                <input id="submit_button" type="submit" value="Réserver" />
              </form>
            </div>
            <div id="callbackMessage">
            </div>
          </IonContent>
        </IonModal>


        <IonItem>
          <CardReservation Reservations={reservations} NameRoom={params["nameRoom"]} />
        </IonItem>


      </IonContent>


    </IonPage>


  );
};

export default Schedule;
