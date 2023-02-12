import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import { IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { useState } from 'react';

import './Schedule.css';

const Schedule: React.FC = () => {

  const [date, setDate] = useState(new Date());
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
          <IonDatetime id="calendar" presentation="date"></IonDatetime>
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
