import {
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonCol, IonRow,
  IonModal, IonContent, IonToolbar, IonTitle
} from '@ionic/react';
import { useRef } from 'react';
import config from "../../config.json";
import './CardSchedule.css'

type CardScheduleProps = {
  Reservations: any;
  NameRoom: any;
}


const CardReservation = ({ Reservations, NameRoom }: CardScheduleProps) => {

  //pour le modal d'ajout d'une réservation
  const modal = useRef<HTMLIonModalElement>(null);

  function deleteAReservation(reservationId: any) {
    //pour supprimer une réservation
    let modalBox = document.getElementById("ModalFor" + reservationId);
    if (typeof (reservationId) === "number") {
      fetch(config.API_URL + "/reservations/deleteOne", {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' },
        body: (
          JSON.stringify({
            id: reservationId,
          }
          )
        ),
      }).then(function (res) {
        if (res.status === 200) {
          if (modalBox !== undefined && modalBox !== null) {
            modalBox.innerHTML = "<p id='success_response'>Votre réservation a bien été supprimée.<br/>Rafraichissez la page pour avoir les nouvelles données.</p>";
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

  function checkIfThereIsAlreadyAReservation(hourBegin: any, hourEnd: any, dateChosen: any, idReservation: any) {
    //cette fonction va regarder s'il y a déjà une réservation à ce moment-là
    let alreadyReserved = false;
    Reservations.forEach((reservation: any) => {
      if (reservation.idRe != idReservation) {
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
      }
    })
    return alreadyReserved;

  }

  function allFieldsChecked(form: any, idReservation: any, dayReservation : any) {
    //cette fonction va regarder si tous les champs sont conformes
    //pour la box qui va afficher les messages lors de la réservation
    let responseBox = document.getElementById("callbackMessageModify");

    //variable qui va contenir le message d'erreur
    let problem = undefined;
    if (dayReservation === "" || form.hourBegin.value === "" || form.hourEnd.value === "") {
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
    else if (checkIfThereIsAlreadyAReservation(form.hourBegin.value, form.hourEnd.value, dayReservation, idReservation)) {
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

  function handleSubmit(event: any, idReservation: any, dayReservation : any) {
    //cache le bouton
    let submitButton = document.getElementById("submit_button_modify");
    if (submitButton !== undefined && submitButton !== null) {
      submitButton.style.display = "none";
    }
    //ne recharge pas la page
    event.preventDefault();
    //pour la box qui va afficher les messages lors de la modification de réservation
    let responseBox = document.getElementById("callbackMessageModify");
    //pour la box qui où il y a le formulaire de modification de réservation
    let formReservation = document.getElementById("formReservationModify");

    //pour afficher un message en attendant
    if (responseBox !== undefined && responseBox !== null) {
      responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
    }


    if (allFieldsChecked(event.target, idReservation, dayReservation)) {
      //si tous les champs respectent bien ce qu'il faut

      fetch(config.API_URL + "/reservations/updateOne", {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
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

            responseBox.innerHTML = "<p id='success_response'>Votre réservation a bien été mise à jour.<br/>Rafraichissez la page pour avoir les nouvelles données.</p>";

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
      {Reservations.length != 0 ? Reservations.map((reservation: any) => (
        <IonCard color="warning" key={reservation["idRe"]}>
          <IonCardHeader>
            <IonCardTitle>{reservation["teacherName"]}</IonCardTitle>
            <IonCardSubtitle>
              {reservation["hourBegin"]} - {reservation["hourEnd"]}
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            {reservation["title"]}
            <IonRow>

              <IonCol>
                <IonButton color="success" className="button_card" id={`modify_button_for${reservation['idRe']}`}>📝 Modifier</IonButton>
                <IonModal id="example-modal" ref={modal} trigger={`modify_button_for${reservation['idRe']}`}>
                  <IonContent>
                    <IonToolbar color="warning">
                      <IonTitle>Réservation {NameRoom}</IonTitle>
                    </IonToolbar>
                    <div id="formReservationModify">
                      <form onSubmit={(e) => handleSubmit(e, reservation['idRe'], reservation['day'])}>
                        <label htmlFor="day">Jour de la réservation:</label>
                        <input type="date" id="day" name="day" defaultValue={reservation.day} disabled required /><br />
                        <table>
                          <tbody>
                            <tr><td><label htmlFor="hourBegin" className='hour_begin_field'>Début:</label></td><td><label htmlFor="hourEnd" className='hour_end_field'>Fin:</label></td></tr>
                            <tr>
                              <td><input type="time" id="hourBegin" name="hourBegin" required className='hour_begin_field' min="08:00" max="18:00" defaultValue={reservation.hourBegin}></input></td>
                              <td><input type="time" id="hourEnd" className='hour_end_field' name="hourEnd" placeholder='10:30' required min="08:00" max="18:00" defaultValue={reservation.hourEnd}></input></td>
                            </tr>
                          </tbody>
                        </table>
                        <p id="message_schedule">Les horaires vont de 8:00 à 18:00</p>
                        <br />
                        <label htmlFor="nameReservation">Intitulé de la réservation:</label>
                        <input type="text" id="nameReservation" name="nameReservation" required defaultValue={reservation.title}></input><br />
                        <input id="submit_button_modify" type="submit" value="Modifier" />
                      </form>
                    </div>
                    <div id="callbackMessageModify">
                    </div>
                  </IonContent>
                </IonModal>
              </IonCol>

              <IonCol>
                <IonButton color="danger" className="button_card" id={`delete_button_for${reservation['idRe']}`}>❌Supprimer</IonButton>
                <IonModal id="delete_reservationmodal" ref={modal} trigger={`delete_button_for${reservation['idRe']}`}>
                  <div className='wrapper' id={`ModalFor${reservation['idRe']}`}>
                    <h4>Voulez-vous vraiment supprimer définitivement la réservation "{reservation["title"]}"
                      de {reservation["hourBegin"]} à {reservation["hourEnd"]} ? </h4>
                    <IonButton color="danger" onClick={() => deleteAReservation(reservation['idRe'])}>Supprimer</IonButton>
                  </div>
                </IonModal>
              </IonCol>

            </IonRow>
          </IonCardContent>
        </IonCard>

      ))
        :
        <h3 className='no_reservation'>Aucune réservations pour le moment.</h3>
      }
    </div>
  );
};

export default CardReservation;
