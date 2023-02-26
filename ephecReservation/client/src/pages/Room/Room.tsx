import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState, useEffect } from 'react';

//importation des autres fichiers
import './Room.css';
import CardRoom from "../../components/CardRoom/CardRoom"
import config from "../../config.json"

const Room: React.FC = () => {
  //pour avoir tout les locaux
  const [rooms, setRooms] = useState([]);


  const fetchRooms = async () => {
    /*
    *   Récupère les informations de tout les locaux
    */
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





  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Locaux</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <CardRoom Rooms={rooms} />



      </IonContent>
    </IonPage>
  );
};

export default Room;
