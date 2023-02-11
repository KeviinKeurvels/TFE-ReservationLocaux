import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Schedule.css';

const Schedule: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Horaire</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">EPHEC Reservation</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Page Horaire" />
      </IonContent>
    </IonPage>
  );
};

export default Schedule;
