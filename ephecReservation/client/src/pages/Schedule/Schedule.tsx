import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import { IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { useState, useEffect } from 'react';

import './Schedule.css';

import config from "../../config.json";

const Schedule: React.FC = () => {
  //le jour d'aujourd'hui
  let currentDate = new Date();
  //l'année actuelle
  let currentYear = currentDate.getFullYear();
  
  //pour avoir les reservations d'un jour
  const [reservations, setReservations] = useState([]);

  const [dateChosen, setDateChosen] = useState(formatDate(currentDate));

      /*
      *   Récupère les informations d'une réservation pour un jour
    */
      const fetchOneReservation = async () => {
        try {
          fetch(config.API_URL + "/reservations/byDay?day='"+dateChosen+"'")
            .then((res) => res.json())
            .then((res) => {
              setReservations(res);
            })
        }
        catch (err) {
          console.log(err);
        }
      }


  //le useEffect de dateChosen qui fait que quand on change de date, il va re fetch
  useEffect(() => {

    fetchOneReservation()
  }, [dateChosen]);


  function getInformationFromADate(date: any) {
    //si la date est bien du bon format et bon compris dans la range d'année
    if ([currentYear - 1, currentYear, currentYear + 1, currentYear + 2, currentYear + 3].includes(new Date(date).getFullYear())) {
      let goodFormatDate=formatDate(date);
      setDateChosen(goodFormatDate);
    }
    else {//si mauvaise date
      return -1;
    }

  }

  //pour avoir la date dans le bon format pour la DB
  function formatDate(date : any) {
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
          <IonTitle>Horaire L101</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1 id="title_schedule">Choisissez un jour</h1>
        <IonItem>
          <IonDatetime
            presentation="date"
            value={dateChosen}
            min={String(currentYear - 1)}
            max={String(currentYear + 3)}
            onIonChange={(e) =>getInformationFromADate(e.target.value)}
          >
          </IonDatetime>
        </IonItem>

        <h1 id="title_schedule">Réservations</h1>

        {reservations.map(reservation => (
          <IonCard color="warning" key={reservation["idRe"]}>
            <IonCardHeader>
              <IonCardTitle>Arnaud Dewulf</IonCardTitle>
              <IonCardSubtitle>{reservation["hourBegin"]} - {reservation["hourEnd"]}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              {reservation["title"]}
            </IonCardContent>
          </IonCard>
        ))

        }


      </IonContent>
    </IonPage>
  );
};

export default Schedule;
