import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import { IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { useState, useEffect } from 'react';
import axios from "axios";

import './Schedule.css';

import config from "../config.json";

const Schedule: React.FC = () => {
  const [reservations, setReservations] = useState([]);
  const fetchOneReservation= async()=>{
    try{
      fetch(config.API_URL + "/reservations")
      .then((res) => res.json())
      .then((res) => {
      
      setReservations(res);
    })}
    catch(err){
      console.log(err);
    }
  }
  /*Appelle la fonction getDetailAnnonce au début du composant*/
  useEffect(() => {
        /*
   *   Récupère les détails d'une proposition
   */

    fetchOneReservation()
  }, []);
  let currentYear= new Date().getFullYear();

  function getInformationFromADate(date : any){
    //si la date est bien du bon format et bon compris dans la range d'année
    if([currentYear-1, currentYear, currentYear+1,currentYear+2,currentYear+3].includes(new Date(date).getFullYear())){
      console.log(new Date(date));
    }
    else{//si mauvaise date
      return -1;
    }
    
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
        min={String(currentYear-1)}
        max={String(currentYear+3)}
        onIonChange={(e)=>getInformationFromADate(e.target.value)}
      >
      </IonDatetime>
        </IonItem>

        <h1 id="title_schedule">Réservations</h1>

        {reservations.map(reservation=>(
                  <IonCard color="warning" key={reservation["idRe"]}>
                  <IonCardHeader>
                    <IonCardTitle>{reservation["idRe"]}</IonCardTitle>
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
