import {
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonCol, IonRow,
  IonModal, IonContent, IonToolbar, IonTitle
} from '@ionic/react';
import { useRef } from 'react';

//importations des fichiers et fonctions
import config from "../../config.json";
import './CardSchedule.css'
import { allFieldsChecked } from '../../functions/CardReservations/CardReservations';

type CardScheduleProps = {
  Reservations: any;
  NameRoom: any;
  fetchAllReservationForOneDay: () => void;
}


const CardSchedule = ({ Reservations, NameRoom, fetchAllReservationForOneDay }: CardScheduleProps) => {

  //pour le modal d'ajout d'une réservation
  const modal = useRef<HTMLIonModalElement>(null);

  function deleteAReservation(reservationId: any, day: any) {
    //pour supprimer une réservation
    let modalBox = document.getElementById("modal_for_" + reservationId);
    if (typeof (reservationId) === "number") {
      fetch(config.API_URL + "/reservations/deleteOne", {
        method: 'DELETE',
        headers: { 
          'Content-type': 'application/json',

              'Authorization': `${localStorage.getItem('token')}`,
              'upn': `${localStorage.getItem('upn')}`
            },
        body: (
          JSON.stringify({
            id: reservationId,
          }
          )
        ),
      }).then(function (res) {
        if (res.status === 200) {
          if (modalBox !== undefined && modalBox !== null) {
            modalBox.innerHTML = "<p id='success_response'>Votre réservation a bien été supprimée.";
            fetchAllReservationForOneDay();
          }
        }
        else {
          if (modalBox !== undefined && modalBox !== null) {
            modalBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
          }
        }
      })
        .catch(function (res) {
          if (modalBox !== undefined && modalBox !== null) {
            modalBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
          }
        })
    }
  }

  function handleSubmit(event: any, idReservation: any, dayReservation: any) {
    //cache le bouton
    let submitButton = document.getElementById("submit_button_modify");
    if (submitButton !== undefined && submitButton !== null) {
      submitButton.style.display = "none";
    }
    //ne recharge pas la page
    event.preventDefault();
    //pour la box qui va afficher les messages lors de la modification de réservation
    let responseBox = document.getElementById("callback_message_modify");
    //pour la box qui où il y a le formulaire de modification de réservation
    let formReservation = document.getElementById("form_reservation_modify");

    //pour afficher un message en attendant
    if (responseBox !== undefined && responseBox !== null) {
      responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
    }
    if (allFieldsChecked(event.target, idReservation, dayReservation, Reservations)) {
      //si tous les champs respectent bien ce qu'il faut

      fetch(config.API_URL + "/reservations/updateOne", {
        method: 'PUT',
        headers: { 'Content-type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
            'upn': `${localStorage.getItem('upn')}`
           },
        body: (
          JSON.stringify({
            idRe: idReservation,
            title: event.target.nameReservation.value,
            day: dayReservation,
            hourBegin: event.target.hourBegin.value,
            hourEnd: event.target.hourEnd.value,
          }
          )
        ),
      }).then(function (res) {
        if (responseBox !== undefined && responseBox !== null) {
          if (res.status === 200) {
            if (formReservation !== undefined && formReservation !== null) {
              formReservation.innerHTML = "";
            }

            responseBox.innerHTML = "<p id='success_response'>Votre réservation a bien été mise à jour.</p>";
            fetchAllReservationForOneDay();
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
    <div className='content_reservation'>
      {Reservations.length !== 0 ? Reservations.map((reservation: any) => (
        <IonCard color={reservation["title"].includes("UNAVAILABLE:") ? "danger" : "warning"} key={reservation["idRe"]}>
          <IonCardHeader>
            <IonCardTitle>{reservation["title"].includes("UNAVAILABLE:") ? reservation["title"].substring(12) : reservation["teacherName"]}</IonCardTitle>
            <IonCardSubtitle>
              {reservation["hourBegin"]} - {reservation["hourEnd"]}
            </IonCardSubtitle>
          </IonCardHeader>
          {reservation["title"].includes("UNAVAILABLE:") ? "" :
          <IonCardContent>
            {reservation["title"]}
            {reservation["upn"] === localStorage.getItem('upn') 
            ? 
              <IonRow>
                <IonCol>
                  <IonButton color="success" className="button_card" id={`modify_button_for${reservation['idRe']}`}>📝 Modifier</IonButton>
                  <IonModal id="example-modal" ref={modal} trigger={`modify_button_for${reservation['idRe']}`}>
                    <IonContent>
                      <IonToolbar color="warning">
                        <IonTitle>Réservation {NameRoom}</IonTitle>
                      </IonToolbar>
                      <div id="form_reservation_modify">
                        <form onSubmit={(e) => handleSubmit(e, reservation['idRe'], reservation['day'])}>
                          <label htmlFor="day">Jour de la réservation:</label>
                          <input type="date" id="day" name="day" defaultValue={reservation.day} disabled required /><br />
                          <table>
                            <tbody>
                              <tr><td><label htmlFor="hour_begin" className='hour_begin_field'>Début:</label></td><td><label htmlFor="hour_end" className='hour_end_field'>Fin:</label></td></tr>
                              <tr>
                                <td><input type="time" id="hour_begin" name="hourBegin" required className='hour_begin_field' min="08:00" max="18:00" defaultValue={reservation.hourBegin}></input></td>
                                <td><input type="time" id="hour_end" className='hour_end_field' name="hourEnd" placeholder='10:30' required min="08:00" max="18:00" defaultValue={reservation.hourEnd}></input></td>
                              </tr>
                            </tbody>
                          </table>
                          <p id="message_schedule">Les horaires vont de 8:00 à 18:00</p>
                          <br />
                          <label htmlFor="name_reservation">Intitulé de la réservation:</label>
                          <input type="text" id="name_reservation" name="nameReservation" required defaultValue={reservation.title}></input><br />
                          <input id="submit_button_modify" type="submit" value="Modifier" />
                        </form>
                      </div>
                      <div id="callback_message_modify">
                      </div>
                    </IonContent>
                  </IonModal>
                </IonCol>

                <IonCol>
                  <IonButton color="danger" className="button_card" id={`delete_button_for${reservation['idRe']}`}>❌Supprimer</IonButton>
                  <IonModal id="delete_reservationmodal" ref={modal} trigger={`delete_button_for${reservation['idRe']}`}>
                    <div className='wrapper' id={`modal_for_${reservation['idRe']}`}>
                      <h4>Voulez-vous vraiment supprimer définitivement la réservation "{reservation["title"]}"
                        de {reservation["hourBegin"]} à {reservation["hourEnd"]} ? </h4>
                      <IonButton color="danger" onClick={() => deleteAReservation(reservation['idRe'], reservation['day'])}>Supprimer</IonButton>
                    </div>
                  </IonModal>
                </IonCol>

              </IonRow>
              : null}
            
          </IonCardContent>
          }
        </IonCard>

      ))
        :
        <h3 className='no_reservation'>Aucune réservations pour le moment.</h3>
      }
    </div>
  );
};

export default CardSchedule;
