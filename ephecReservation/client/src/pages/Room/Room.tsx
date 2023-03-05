import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

//importation des autres fichiers
import './Room.css';
import CardRoom from "../../components/CardRoom/CardRoom"
import config from "../../config.json"

const Room: React.FC = () => {
    //récupération des paramètres
    let  params : any; 
    params = useParams();

  //pour avoir tout les locaux
  const [rooms, setRooms] = useState([]);


  const fetchRooms = async () => {
    /*
    *   Récupère les informations de tout les locaux
    */
      fetch(config.API_URL + "/rooms/byImplantation?implantation='"+ params["nameImplantation"]+"'")
        .then((res) => res.json())
        .then((res) => {
          setRooms(res);
        })
        .catch((err)=>console.log(err))

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
