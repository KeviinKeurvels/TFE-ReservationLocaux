import {
  IonCol, IonDatetime, IonIcon, IonRow, IonList, IonSelect, IonButton,
  IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonPage, IonItem,
  IonSelectOption
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import React from 'react';
import { addOutline, refreshOutline } from 'ionicons/icons';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
//importation des autres fichiers
import './Schedule.css';
import CardSchedule from '../../components/CardSchedule/CardSchedule';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json";
import { getInformationFromADate, formatDate, allFieldsChecked } from '../../functions/Schedule/Schedule';
import { hasSqlInjection } from '../../functions/Login/Login'
//hook pour check si il y a des données
import useAuthentication from "../../hooks/checkAuthentication";



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
  //check si l'utilisateur est connecté
  useAuthentication();
  const history = useHistory();
  //Si l'utilisateur est admin
  const [isAdmin, setIsAdmin] = useState(0);
  //Pour avoir tous les utilisateurs quand c'est un admin qui réserve
  const [users, setUsers] = useState([]);
  //Pour avoir l'utilisateur sélectionné par l'admin
  const [userSelected, setUserSelected] = useState(null);



  const fetchIsAdmin = async () => {
    /*
    *   check si l'utilisateur est administrateur
    */
    setIsLoading(true);
    fetch(config.API_URL + "/auth/checkAdmin?upn='" + localStorage.getItem('upn') + "'", {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'upn': `${localStorage.getItem('upn')}`
      }
    })
      .then((res) => res.json())
      .then((res) => {

        setIsAdmin(res[0].isAdmin);
        setIsLoading(false);
      })
      .catch((err) => console.log(err))

  }

  const getAllUser = () => {
    //récupére toutes les users et le met dans la variable users
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    const headers = {
      'Authorization': `${localStorage.getItem('token')}`,
      'upn': `${localStorage.getItem('upn')}`
    };
    fetch(`${config.API_URL}/admin/getAllUsers`, { headers, signal })
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.log(err)
        }
      });

    return () => controller.abort();
  }

  const fetchAllReservationForOneDay = async () => {
    /*
    *   Récupère les informations d'une réservation pour un jour
    */
    setIsLoading(true);
    fetch(config.API_URL + "/reservations/byRoomAndDay?day='" + dateChosen + "'&room='" + params["nameRoom"] + "'", {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'upn': `${localStorage.getItem('upn')}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        setReservations(res);
        setIsLoading(false);
      })
      .catch((err) => console.log(err))

  }


  //le useEffect de dateChosen qui fait que quand on change de date, il va re fetch
  useEffect(() => {
    if (localStorage.length === 0 || hasSqlInjection(localStorage.getItem('upn'), localStorage.getItem('token'))) {
      //si le localStorage est vide ou s'il il y a une injection SQL
      history.push("/");
    }
    else {
      fetchIsAdmin()
      fetchAllReservationForOneDay()
    }

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


    if (allFieldsChecked(event.target, reservations, currentYear, formatDate(currentDate))) {
      //si tous les champs respectent bien ce qu'il faut

      //si l'utilisateur est administrateur
      if (isAdmin) {
        if (userSelected !== null) {
          fetch(config.API_URL + "/admin/addReservation", {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `${localStorage.getItem('token')}`,
              'upn': `${localStorage.getItem('upn')}`
            },
            body: (
              JSON.stringify({
                title: event.target.nameReservation.value,
                day: event.target.day.value,
                hourBegin: event.target.hourBegin.value,
                hourEnd: event.target.hourEnd.value,
                idTe: userSelected,
                nameRoom: params["nameRoom"],
              }
              )
            ),
          }).then(function (res) {
            setUserSelected(null);
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
          if (responseBox !== undefined && responseBox !== null) {
            responseBox.innerHTML = "<p id='failed_response'>Aucun utilisateur sélectionné</p>";
          }
          if (submitButton !== undefined && submitButton !== null) {
            submitButton.style.display = "block";
          }
        }
      }

      //si l'utilisateur n'est pas administrateur
      else {
        fetch(config.API_URL + "/reservations", {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
            'upn': `${localStorage.getItem('upn')}`
          },
          body: (
            JSON.stringify({
              title: event.target.nameReservation.value,
              day: event.target.day.value,
              hourBegin: event.target.hourBegin.value,
              hourEnd: event.target.hourEnd.value,
              upn: localStorage.getItem('upn'),
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
            min={String(formatDate(currentDate))}
            max={String(currentYear + 2)}
            onIonChange={(e) => getInformationFromADate(e.target.value, setDateChosen, currentYear, formatDate(currentDate))}
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
                {isAdmin ?
                  <div>
                    <IonList>
                      <IonItem>
                        <IonSelect placeholder="Choisissez un utilisateur :" onClick={getAllUser} onIonChange={(e) => setUserSelected(e.target.value)}>
                          {users.length === 0 ?
                            <IonSelectOption disabled>
                              Chargement des utilisateurs en cours...
                            </IonSelectOption>
                            : null}
                          {users.map((user) => (
                            <IonSelectOption key={user["idTe"]} value={user["idTe"]} >
                              {user["name"]}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </IonList>
                    <br />
                  </div>
                  : null}

                <label htmlFor="day">Jour de la réservation:</label>
                <input type="date" id="day" name="day" defaultValue={dateChosen} onChange={(e) => getInformationFromADate(e.target.value, setDateChosen, currentYear, currentDate)} min={String(formatDate(currentDate))} max={String(currentYear + 2)} required /><br />

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
