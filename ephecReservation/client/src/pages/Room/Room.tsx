import { IonCardContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Room.css';
import config from "../../config.json"

const Room: React.FC = () => {
  //pour avoir les reservations d'un jour
  const history = useHistory();
  const [rooms, setRooms] = useState([]);

  /*
  *   Récupère les informations de tout les locaux
*/
  const fetchRooms = async () => {
    try {
      fetch(config.API_URL + "/rooms")
        .then((res) => res.json())
        .then((res) => {
          setRooms(res);
        })
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {

    fetchRooms()
  }, []);


  function redirectToSchedule(idRoom : number) {
    history.push("/schedule/"+idRoom);
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Locaux</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {rooms.map(room => (
          <IonCard onClick={() => redirectToSchedule(room["idRo"])} key={room["idRo"]}>
            <IonCardHeader>
              <IonCardTitle>{room["name"]}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {room["description"]}
            </IonCardContent>
          </IonCard>
        ))}


      </IonContent>
    </IonPage>
  );
};

export default Room;
