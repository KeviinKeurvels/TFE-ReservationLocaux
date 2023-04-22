import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment,
  IonSegmentButton, IonLabel, IonButton, IonRow, IonCol, IonModal, IonItem, IonList, IonSelect,
  IonSelectOption
} from '@ionic/react';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
//importations des fichiers et fonctions
import './Administration.css';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import GraphRooms from '../../components/GraphRooms/GraphRooms';
import { formatDate } from '../../functions/Schedule/Schedule';
import {
  handleSubmitUnavailable, handleSubmitAddRoom, handleSubmitDeleteRoom, handleSubmitModifyRoom,
  handleChangeImplantation, handleChangeRoom, loadDataGraph, subtractDays, addDays
} from '../../functions/AdministrationRoom/AdministrationRoom'
import { hasSqlInjection } from '../../functions/Login/Login'
import config from "../../config.json";
//hook pour check si il y a des données
import useAuthentication from "../../hooks/checkAuthentication";

const Administration: React.FC = () => {

  //pour le modal d'ajout d'une réservation
  const modal = useRef<HTMLIonModalElement>(null);
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);
  //pour faire la distinction entre les différentes pages
  const [segment, setSegment] = useState("implantations");
  const [implantations, setImplantations] = useState([]);
  const [selectedImplantation, setSelectedImplantation] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dataGraph, setDataGraph] = useState([]);
  const [dateForGraph, setDateForGraph] = useState(new Date());
  const [selectedRoomForGraph, setSelectedRoomForGraph] = useState(null);
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

  useEffect(() => {
    // quand change la valeur pour la date du graphique, ça va charger les informations
    if (selectedRoomForGraph != null) {
      loadDataGraph(selectedRoomForGraph, setIsLoading, config, setDataGraph, setSelectedRoomForGraph, formatDate(dateForGraph));
    }
  }, [dateForGraph]);



  const handleChange = (e: any) => {
    setSegment(e.detail.value);
  };

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
          <IonSegmentButton value="implantations">
            <IonLabel>Implantations</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="rooms">
            <IonLabel>Locaux</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segment === "implantations" && (
          <div id='content_implantations'>
            <div>
              <h1 className='title_administration'>Actions</h1>
              <p>Ici c'est pour l'implantation</p>
            </div>
          </div>
        )}

        {segment === "rooms" && (
          <div id='content_rooms'>
            <h1 className='title_administration'>Actions</h1>
            <IonRow>
              <IonCol>
                <IonButton className='button_admin' color="success" id="add_room_button">Ajouter un local</IonButton>
                <IonModal id="example-modal" ref={modal} trigger="add_room_button">
                  <IonContent>
                    <IonToolbar color="warning">
                      <IonTitle>Ajout local</IonTitle>
                    </IonToolbar>
                    <div>
                      <form onSubmit={(e) => handleSubmitAddRoom(e, selectedImplantation, config)} id="form_add_room">
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
            </IonRow>


            <IonRow>
              <IonCol>
                <IonButton className='button_admin' color="secondary" id="modify_room_button">Modifier un local</IonButton>
                <IonModal id="example-modal" ref={modal} trigger="modify_room_button">
                  <IonContent>
                    <IonToolbar color="warning">
                      <IonTitle>Modification local</IonTitle>
                    </IonToolbar>
                    <div>
                      <form onSubmit={(e) => handleSubmitModifyRoom(e, selectedRoom, config)} id="form_modify_room">
                        <IonList>
                          <IonItem>
                            <IonSelect placeholder="Choisissez une implantation :" onIonChange={(e) => handleChangeImplantation(e, setSelectedImplantation, setRooms, setIsLoading, config)}>
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
                            <IonSelect placeholder="Choisissez un local :" onIonChange={(e) => handleChangeRoom(e, setSelectedRoom, rooms, setIsLoading)}>
                              {rooms.map((room) => (
                                <IonSelectOption key={room["idRo"]} value={room["idRo"]}>
                                  {room["name"]}
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
                        <input id="submit_button_modify_room" type="submit" value="Modifier" />
                      </form>
                    </div>
                    <div id="callback_message_modify_room">
                    </div>
                  </IonContent>
                </IonModal>
              </IonCol>
            </IonRow>


            <IonRow>
              <IonCol>
                <IonButton className='button_admin' color="danger" id="delete_room_button">Supprimer un local</IonButton>
                <IonModal id="example-modal" ref={modal} trigger="delete_room_button">
                  <IonContent>
                    <IonToolbar color="warning">
                      <IonTitle>Suppression local</IonTitle>
                    </IonToolbar>
                    <div>
                      <form onSubmit={(e) => handleSubmitDeleteRoom(e, selectedRoom, config)} id="form_delete_room">
                        <IonList>
                          <IonItem>
                            <IonSelect placeholder="Choisissez une implantation :" onIonChange={(e) => handleChangeImplantation(e, setSelectedImplantation, setRooms, setIsLoading, config)}>
                              {implantations.map((implantation) => (
                                <IonSelectOption key={implantation["idIm"]} value={implantation["name"]}>
                                  {implantation["name"]}
                                </IonSelectOption>
                              ))}
                            </IonSelect>
                          </IonItem>
                        </IonList>
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
                <IonButton className='button_admin' color="warning" id="unavailable_room_button">Rendre un local indisponible</IonButton>
                <IonModal id="example-modal" ref={modal} trigger="unavailable_room_button">
                  <IonContent>
                    <IonToolbar color="warning">
                      <IonTitle>Indisponibilité</IonTitle>
                    </IonToolbar>
                    <div>
                      <form onSubmit={(e) => handleSubmitUnavailable(e, selectedImplantation, selectedRoom, config)} id="form_unavailable">
                        <IonList>
                          <IonItem>
                            <IonSelect placeholder="Choisissez une implantation :" onIonChange={(e) => handleChangeImplantation(e, setSelectedImplantation, setRooms, setIsLoading, config)}>
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


            <h1 className='title_administration'>Statistiques</h1>
            <div id="statistics_content">
              <IonList className='fields_statistics'>
                <IonItem>
                  <IonSelect placeholder="Choisissez une implantation :" onIonChange={(e) => handleChangeImplantation(e, setSelectedImplantation, setRooms, setIsLoading, config)}>
                    {implantations.map((implantation) => (
                      <IonSelectOption key={implantation["idIm"]} value={implantation["name"]}>
                        {implantation["name"]}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonList>
              <IonList className='fields_statistics'>
                <IonItem>
                  <IonSelect placeholder="Choisissez un local :" onIonChange={(e) => { loadDataGraph(e.target.value, setIsLoading, config, setDataGraph, setSelectedRoomForGraph, formatDate(dateForGraph)) }}>
                    {rooms.map((room) => (
                      <IonSelectOption key={room["idRo"]} value={room["idRo"]}>
                        {room["name"]}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonList>
              <div id="callback_message_graph"></div>
              <div>
                <p>Les 7 derniers jours avant le <span id="dateGraph">{`${dateForGraph.getDate().toString().padStart(2, '0')}-${(dateForGraph.getMonth() + 1).toString().padStart(2, '0')}-${dateForGraph.getFullYear()}`}</span></p>
                <IonRow>
                  <IonCol>
                    <IonButton fill='outline' color="danger" onClick={() => subtractDays(dateForGraph, setDateForGraph)}>7 jours plus tôt</IonButton>

                  </IonCol>
                  <IonCol>
                    <IonButton fill='outline' color="success" onClick={() => addDays(dateForGraph, setDateForGraph)}>7 jours plus tard</IonButton>

                  </IonCol>
                </IonRow>
                <p className='form_text'>Seules les réservations antérieures à ajourd'hui sont visualisables.</p>

              </div>
              <GraphRooms data={dataGraph} />
            </div>

          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Administration;