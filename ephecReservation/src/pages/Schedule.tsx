import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import { IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';

import './Schedule.css';

const Schedule: React.FC = () => {
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
        
        <IonCard color="warning">
          <IonCardHeader>
            <IonCardTitle>Arnaud Dewulf</IonCardTitle>
            <IonCardSubtitle>10:30 - 12:30</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            Cours de math théorie
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Schedule;
