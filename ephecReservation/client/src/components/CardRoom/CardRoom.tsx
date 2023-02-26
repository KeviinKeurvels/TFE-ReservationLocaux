import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonContent} from '@ionic/react';
import { useHistory } from 'react-router-dom';


type CardRoomProps = {
  Rooms: any;
}

const CardRoom  = ({ Rooms }: CardRoomProps) => {
  const history = useHistory();

  function redirectToSchedule(nameRoom : number) {
    //va rediriger vers la page schedule du local
    history.push("/schedule/"+nameRoom);
    //va reload la page pour actualiser les réservations
    window.location.reload();
  }

  return (
    <IonContent>
    {Rooms.map((room: any) => (
      <IonCard onClick={() => redirectToSchedule(room["name"])} key={room["idRo"]}>
        <IonCardHeader>
          <IonCardTitle>{room["name"]}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {room["description"]}
        </IonCardContent>
      </IonCard>
    ))}
    </IonContent>
  );
};

export default CardRoom;
