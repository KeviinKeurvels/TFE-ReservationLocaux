import { IonCard, IonCardHeader, IonCardContent, IonCardTitle} from '@ionic/react';
import { useHistory } from 'react-router-dom';


type CardRoomProps = {
  Rooms: any;
}

const CardRoom  = ({ Rooms }: CardRoomProps) => {
  const history = useHistory();

  function redirectToSchedule(idRoom : number) {
    //va rediriger vers la page schedule du local
    history.push("/schedule/"+idRoom);
  }

  return (
    <div>
    {Rooms.map((room: any) => (
      <IonCard onClick={() => redirectToSchedule(room["idRo"])} key={room["idRo"]}>
        <IonCardHeader>
          <IonCardTitle>{room["name"]}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {room["description"]}
        </IonCardContent>
      </IonCard>
    ))}
    </div>
  );
};

export default CardRoom;
