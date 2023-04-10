import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment,
  IonSegmentButton, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonRow, IonCol, IonModal, IonItem, IonList, IonSelect, IonSelectOption
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
//importations des fichiers et fonctions
import './Administration.css';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import { formatDate } from '../../functions/Schedule/Schedule';
import { allFieldsCheckedUnavailable, allFieldsCheckedAddRoom, allFieldsCheckedDeleteRoom } from '../../functions/Administration/Administration'
import {hasSqlInjection} from '../../functions/Login/Login'
import config from "../../config.json";
//hook pour check si il y a des données
import useAuthentication from "../../hooks/checkAuthentication";

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
  //check si l'utilisateur est connecté
  useAuthentication();
  const history = useHistory();


  useEffect(() => {

    /*
    *   Récupère les informations de toutes les implantations
    */
    if (localStorage.length === 0 || hasSqlInjection(localStorage.getItem('upn'), localStorage.getItem('token'))) {
      //si le localStorage est vide ou s'il il y a une injection SQL
      history.push("/");
    }
    else {
      const controller = new AbortController();
      const signal = controller.signal;
      setIsLoading(true);
      fetch(config.API_URL + "/implantations", {
        signal,
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'upn': `${localStorage.getItem('upn')}`
        }
      })
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
    }
  }, []);


  const handleChangeImplantation = (event: any) => {
    const selectedImplantation = event.target.value;
    setSelectedImplantation(selectedImplantation);
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    const headers = {
      'Authorization': `${localStorage.getItem('token')}`,
      'upn': `${localStorage.getItem('upn')}`
    };
    fetch(`${config.API_URL}/rooms/byImplantation?implantation='${selectedImplantation}'`, { headers, signal })
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

  const handleChange = (e: any) => {
    setSegment(e.detail.value);
  };


  //POUR RENDRE UN LOCAL INDISPONIBLE
  function handleSubmitUnavailable(event: any) {
    //cache le bouton
    let submitButton = document.getElementById("submit_button_unavailable");
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


    if (allFieldsCheckedUnavailable(event.target, selectedImplantation, selectedRoom)) {
      //si tous les champs respectent bien ce qu'il faut
      //on supprime les réservations qui sont pendant la période de temps
      fetch(config.API_URL + "/admin/deleteAllReservationsForAPeriod", {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
          'upn': `${localStorage.getItem('upn')}`
        },
        body: (
          JSON.stringify({
            day: event.target.day.value,
            hourBegin: event.target.hourBegin.value,
            hourEnd: event.target.hourEnd.value,
            nameRoom: selectedRoom
          }
          )
        ),
      }).then(function (res) {
        if (res.status === 200) {
          //on met la réservation d'indisponibilité
          fetch(config.API_URL + "/reservations", {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `${localStorage.getItem('token')}`,
              'upn': `${localStorage.getItem('upn')}`
            },
            body: (
              JSON.stringify({
                title: "UNAVAILABLE:" + event.target.reason_unavailability.value,
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

                responseBox.innerHTML = "<p id='success_response'>L'indisponibilité a bien été enregistré.</p>";

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


  //POUR AJOUTER UN LOCAL
  function handleSubmitAddRoom(event: any) {
    //cache le bouton
    let submitButton = document.getElementById("submit_button_add_room");
    if (submitButton !== undefined && submitButton !== null) {
      submitButton.style.display = "none";
    }
    //ne recharge pas la page
    event.preventDefault();
    //pour la box qui va afficher les messages lors de l'ajout
    let responseBox = document.getElementById("callback_message_add_room");
    //pour la box qui où il y a le formulaire d'ajout
    let formAddRoom = document.getElementById("form_add_room");

    //pour afficher un message en attendant
    if (responseBox !== undefined && responseBox !== null) {
      responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
    }


    if (allFieldsCheckedAddRoom(event.target, selectedImplantation)) {
      //si tous les champs respectent bien ce qu'il faut
      //on ajoute le local
      fetch(config.API_URL + "/admin/room", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
          'upn': `${localStorage.getItem('upn')}`
        },
        body: (
          JSON.stringify({
            name: event.target.name.value,
            description: event.target.description.value,
            idIm: selectedImplantation,
          }
          )
        ),
      }).then(function (res) {
        if (responseBox !== undefined && responseBox !== null) {
          if (res.status === 200) {
            if (formAddRoom !== undefined && formAddRoom !== null) {
              formAddRoom.innerHTML = "";
            }

            responseBox.innerHTML = "<p id='success_response'>Le local a bien été enregistré.</p>";

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

  //POUR SUPPRIMER UN LOCAL
  function handleSubmitDeleteRoom(event: any) {
    //cache le bouton
    let submitButton = document.getElementById("submit_button_delete_room");
    if (submitButton !== undefined && submitButton !== null) {
      submitButton.style.display = "none";
    }
    //ne recharge pas la page
    event.preventDefault();
    //pour la box qui va afficher les messages lors de l'ajout
    let responseBox = document.getElementById("callback_message_delete_room");
    //pour la box qui où il y a le formulaire d'ajout
    let formDeleteRoom = document.getElementById("form_delete_room");

    //pour afficher un message en attendant
    if (responseBox !== undefined && responseBox !== null) {
      responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
    }


    if (allFieldsCheckedDeleteRoom(selectedRoom)) {
      //si tous les champs respectent bien ce qu'il faut
      //on supprime le local
      fetch(config.API_URL + "/admin/deleteAllReservationsForARoom", {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
          'upn': `${localStorage.getItem('upn')}`
        },
        body: (
          JSON.stringify({
            idRo: selectedRoom
          }
          )
        ),
      }).then(function (res) {
        if (responseBox !== undefined && responseBox !== null) {
          if (res.status === 200) {
            //on supprime les réservations du local supprimé
            fetch(config.API_URL + "/admin/room", {
              method: 'DELETE',
              headers: {
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`,
                'upn': `${localStorage.getItem('upn')}`
              },
              body: (
                JSON.stringify({
                  idRo: selectedRoom
                }
                )
              ),
            }).then(function (res) {
              if (res.status === 200) {
                //si la première requête se passe bien
                if (responseBox !== undefined && responseBox !== null) {
                  //si la deuxième requête se passe bien
                responseBox.innerHTML = "<p id='success_response'>Les réservations ont bien été supprimées ainsi que le local.</p>";
                }
              }
              else{
                //si la deuxième requête se passe pas bien
                if (responseBox !== undefined && responseBox !== null) {
                  responseBox.innerHTML = "<p id='failed_response'>Les réservations ont bien été supprimées mais pas le local (cause interne).</p>";
                  }
              }

            }).catch(function (res) {
              //si la deuxième requête se passe pas bien
              if (responseBox !== undefined && responseBox !== null) {
                responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
              }
            })

            if (formDeleteRoom !== undefined && formDeleteRoom !== null) {
              formDeleteRoom.innerHTML = "";
            }
          }
          else {
            //si la première requête se passe pas bien
            responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";

          }

        }
      })
        .catch(function (res) {
          //si la première requête se passe pas bien
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
                  <IonButton color="success" id="add_room_button">Ajouter un local</IonButton>
                  <IonModal id="example-modal" ref={modal} trigger="add_room_button">
                    <IonContent>
                      <IonToolbar color="warning">
                        <IonTitle>Ajout local</IonTitle>
                      </IonToolbar>
                      <div>
                        <form onSubmit={handleSubmitAddRoom} id="form_add_room">
                          <IonList>
                            <IonItem>
                              <IonSelect placeholder="Choisissez une implantation :" onIonChange={(e) => { setSelectedImplantation(e.target.value); }}>
                                {implantations.map((implantation) => (
                                  <IonSelectOption key={implantation["idIm"]} value={implantation["idIm"]}>
                                    {implantation["name"]}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </IonItem>
                          </IonList>
                          <br />
                          <label htmlFor="name">Nom du local:</label>
                          <input type="text" id="name" name="name" required minLength={2} maxLength={40}></input><br />
                          <label htmlFor="description">Description du local:</label>
                          <input type="text" id="description" name="description" required minLength={5} maxLength={100}></input><br />
                          <input id="submit_button_add_room" type="submit" value="Ajouter" />
                        </form>
                      </div>
                      <div id="callback_message_add_room">
                      </div>
                    </IonContent>
                  </IonModal>
                </IonCol>
                <IonCol>
                  <IonButton color="danger" id="delete_room_button">Supprimer un local</IonButton>
                  <IonModal id="example-modal" ref={modal} trigger="delete_room_button">
                    <IonContent>
                      <IonToolbar color="warning">
                        <IonTitle>Supprimer local</IonTitle>
                      </IonToolbar>
                      <div>
                        <form onSubmit={handleSubmitDeleteRoom} id="form_delete_room">
                          <IonList>
                            <IonItem>
                              <IonSelect placeholder="Choisissez une implantation :" onIonChange={handleChangeImplantation}>
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
                                  <IonSelectOption key={room["idRo"]} value={room["idRo"]}>
                                    {room["name"]}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </IonItem>
                          </IonList>
                          <br />
                          <p className='form_text'>Toutes les réservations du local vont être automatiquement supprimées</p>
                          <input id="submit_button_delete_room" type="submit" value="Supprimer" />
                        </form>
                      </div>
                      <div id="callback_message_delete_room">
                      </div>
                    </IonContent>
                  </IonModal>
                </IonCol>
              </IonRow>


              <IonRow>
                <IonCol>
                  <IonButton color="warning" id="unavailable_room_button">Rendre un local indisponible</IonButton>
                  <IonModal id="example-modal" ref={modal} trigger="unavailable_room_button">
                    <IonContent>
                      <IonToolbar color="warning">
                        <IonTitle>Indisponibilité</IonTitle>
                      </IonToolbar>
                      <div>
                        <form onSubmit={handleSubmitUnavailable} id="form_unavailable">
                          <IonList>
                            <IonItem>
                              <IonSelect placeholder="Choisissez une implantation :" onIonChange={handleChangeImplantation}>
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
                                  <IonSelectOption key={room["idRo"]} value={room["name"]}>
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
                          <input type="text" id="reason_unavailability" name="reason_unavailability" required minLength={2} maxLength={40}></input><br />
                          <input id="submit_button_unavailable" type="submit" value="Rendre indisponible" />
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