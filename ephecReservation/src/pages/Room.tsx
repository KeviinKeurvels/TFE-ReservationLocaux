import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Room.css';

const Room: React.FC = () => {
  const history = useHistory();
  function redirectToRoom(){
    history.push("/schedule");
  }


  return (
    <IonPage>
      <IonHeader className='topBar'>
        <IonToolbar id="top_bar">
          <IonTitle>EPHEC Reservation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard onClick={()=>redirectToRoom()}>
          <IonCardHeader>
            <IonCardTitle>Local 101</IonCardTitle>
            <IonCardSubtitle>Petit local</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Room;
