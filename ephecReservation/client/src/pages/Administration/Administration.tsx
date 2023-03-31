import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment,
  IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonRow, IonCol, IonModal, IonItem, IonList, IonSelect, IonSelectOption
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useRef } from 'react';

//importations des fichiers et fonctions
import './Administration.css';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import { formatDate } from '../../functions/Schedule/Schedule';
import config from "../../config.json";

const Administration: React.FC = () => {

  //pour le modal d'ajout d'une réservation
  const modal = useRef<HTMLIonModalElement>(null);
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);
  const [segment, setSegment] = useState("structures");
  const [implantations, setImplantations] = useState([]);
  const [selectedImplantation, setSelectedImplantation] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  //le jour d'aujourd'hui
  let currentDate = new Date();
  //l'année actuelle
  let currentYear = currentDate.getFullYear();
  const dateChosen = formatDate(currentDate);

  useEffect(() => {

    /*
*   Récupère les informations de toutes les implantations
*/
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    fetch(config.API_URL + "/implantations", { signal })
      .then((res) => res.json())
      .then((res) => {
        setImplantations(res);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.log(err)
        }
      });

    return () => controller.abort();
  }, []);

  const handleChangeImplantation = (event: any) => {
    const selectedImplantation = event.target.value;
    setSelectedImplantation(selectedImplantation);
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    fetch(`${config.API_URL}/rooms/byImplantation?implantation='${selectedImplantation}'`, { signal })
      .then((res) => res.json())
      .then((res) => {
        setRooms(res);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.log(err)
        }
      });

    return () => controller.abort();

  };


  function allFieldsChecked(form: any) {
    //cette fonction va regarder si tous les champs sont conformes
    //pour la box qui va afficher les messages lors de la réservation
    let responseBox = document.getElementById("callback_message_unavailable");

    //variable qui va contenir le message d'erreur
    let problem = undefined;
    if (selectedImplantation === "" || selectedRoom === "" || form.hourBegin.value === "" || form.hourEnd.value === "") {
      problem = "Un ou plusieurs champs sont vides";
    }
    else if (form.reason_unavailability.value.length < 2 || form.reason_unavailability.value.length > 40) {
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

    if (problem !== undefined) {
      if (responseBox !== undefined && responseBox !== null) {
        responseBox.innerHTML = "<p id='failed_response'>" + problem + "</p>";
      }
      return false;
    }
    return true;

  }

  const handleChange = (e: any) => {
    setSegment(e.detail.value);
  };



  function handleSubmit(event: any) {
    //cache le bouton
    let submitButton = document.getElementById("submit_button");
    if (submitButton !== undefined && submitButton !== null) {
      submitButton.style.display = "none";
    }
    //ne recharge pas la page
    event.preventDefault();
    //pour la box qui va afficher les messages lors de la réservation
    let responseBox = document.getElementById("callback_message_unavailable");
    //pour la box qui où il y a le formulaire de réservation
    let formUnavailable = document.getElementById("form_unavailable");

    //pour afficher un message en attendant
    if (responseBox !== undefined && responseBox !== null) {
      responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
    }


    if (allFieldsChecked(event.target)) {
      //si tous les champs respectent bien ce qu'il faut
      //on supprime les réservations qui sont pendant la période de temps
      fetch(config.API_URL + "/reservations/deleteAllReservationsForAPeriod", {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' },
        body: (
          JSON.stringify({
            day: event.target.day.value,
            hourBegin: event.target.hourBegin.value,
            hourEnd: event.target.hourEnd.value,
          }
          )
        ),
      }).then(function (res) {
        if (res.status === 200) {
          //on met la réservation d'indisponibilité
          fetch(config.API_URL + "/reservations", {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: (
              JSON.stringify({
                title: "UNAVAILABLE:"+event.target.reason_unavailability.value,
                day: event.target.day.value,
                hourBegin: event.target.hourBegin.value,
                hourEnd: event.target.hourEnd.value,
                idTe: 2,
                nameRoom: selectedRoom,
              }
              )
            ),
          }).then(function (res) {
            if (responseBox !== undefined && responseBox !== null) {
              if (res.status === 200) {
                if (formUnavailable !== undefined && formUnavailable !== null) {
                  formUnavailable.innerHTML = "";
                }
    
                responseBox.innerHTML = "<p id='success_response'>L'indisponibilité à bien été enregistré.</p>";
    
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
          if (responseBox !== undefined && responseBox !== null) {
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
          <IonTitle>Administration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ModalLoading isLoading={isLoading} />
        <IonSegment value={segment} onIonChange={handleChange}>
          <IonSegmentButton value="structures">
            <IonLabel>Structures</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="reservations">
            <IonLabel>Réservations</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segment === "structures" && (
          <div id='content_structures'>
            <div>
              <h1 className='title_administration'>Implantations</h1>
              <p>Ici c'est pour l'implantation</p>
            </div>
            <div>
              <h1 className='title_administration'>Locaux</h1>

              <IonRow>
                <IonCol>
                  <IonButton color="danger" id="unavailable_room_button">Rendre un local indisponible</IonButton>
                  <IonModal id="example-modal" ref={modal} trigger="unavailable_room_button">
                    <IonContent>
                      <IonToolbar color="warning">
                        <IonTitle>Indisponibilité</IonTitle>
                      </IonToolbar>
                      <div>
                        <form onSubmit={handleSubmit} id="form_unavailable">
                          <IonList>
                            <IonItem>
                              <IonSelect id="test" placeholder="Choisissez une implantation :" onIonChange={handleChangeImplantation}>
                                {implantations.map((implantation) => (
                                  <IonSelectOption key={implantation["idIm"]} value={implantation["name"]}>
                                    {implantation["name"]}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </IonItem>
                          </IonList>
                          <br />
                          <IonList>
                            <IonItem>
                              <IonSelect placeholder="Choisissez un local :" onIonChange={(e) => setSelectedRoom(e.target.value)}>
                                {rooms.map((room) => (
                                  <IonSelectOption key={room["idRo"]} defaultValue={room["idRo"]}>
                                    {room["name"]}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </IonItem>
                          </IonList>
                          <br />
                          <label htmlFor="day">Jour de l'indisponibilité:</label>
                          <input type="date" id="day" name="day" defaultValue={dateChosen} min={String(currentYear)} max={String(currentYear + 2)} required /><br />
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
                          <label htmlFor="reason_unavailability">Motif d'indisponibilité:</label>
                        <input type="text" id="reason_unavailability" name="reason_unavailability" required></input><br />
                          <input id="submit_button" type="submit" value="Rendre indisponible" />
                        </form>
                      </div>
                      <div id="callback_message_unavailable">
                      </div>
                    </IonContent>
                  </IonModal>
                </IonCol>
              </IonRow>
            </div>
          </div>
        )}

        {segment === "reservations" && (
          <div id='content_reservations'>
            <IonCard color="danger">
              <IonCardHeader>
                <IonCardTitle>Reservation</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Reservation
              </IonCardContent>
            </IonCard>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Administration;