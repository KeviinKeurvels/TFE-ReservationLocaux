import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonDatetime, IonList, IonGrid, IonVirtualScroll } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import React from 'react';

//importation des autres fichiers
import './Schedule.css';
import CardReservation from '../../components/CardSchedule/CardReservation';
import config from "../../config.json";


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


  const fetchOneReservation = async () => {
    /*
    *   Récupère les informations d'une réservation pour un jour
    */
      fetch(config.API_URL + "/reservations/byRoomAndDay?day='" + dateChosen + "'&room='" + params["nameRoom"] + "'")
        .then((res) => res.json())
        .then((res) => {
          setReservations(res);
        })
        .catch((err)=>console.log(err))
  }


  //le useEffect de dateChosen qui fait que quand on change de date, il va re fetch
  useEffect(() => {

    fetchOneReservation()
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





  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Horaire {params["nameRoom"]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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

        <h1 id="title_schedule">Réservations</h1>
        <CardReservation Reservations={reservations} />

      </IonContent>
    </IonPage>
  );
};

export default Schedule;
