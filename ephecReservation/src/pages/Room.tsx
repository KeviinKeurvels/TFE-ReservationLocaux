import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Room.css';

const Room: React.FC = () => {
  const history = useHistory();
  function redirectToRoom(){
    history.push("/schedule");
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
        <IonTitle>Locaux</IonTitle>
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
