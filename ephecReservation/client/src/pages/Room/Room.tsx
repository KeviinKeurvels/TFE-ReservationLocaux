import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

//importation des autres fichiers
import './Room.css';
import CardRoom from "../../components/CardRoom/CardRoom"
import config from "../../config.json"

const Room: React.FC = () => {
  //récupération des paramètres
  const {nameImplantation : implantation} : any = useParams();
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);
  //pour avoir tout les locaux
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
        /*
    *   Récupère les informations de tout les locaux
    */
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
    fetch(`${config.API_URL}/rooms/byImplantation?implantation='${implantation}'`, {signal})
      .then((res) => res.json())
      .then((res) => {
        setRooms(res);
        setIsLoading(false);
      })
      .catch((err) => {
        if(err.name !== "AbortError"){
          console.log(err)
        }
      });

      return () => controller.abort();
  }, [implantation]);





  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Locaux</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ display: isLoading ? 'flex' : 'none' }} className='modal'>
          <div className='modal-content'>
            <div className='loader'></div>
            <div className='modal-text'>Chargement en cours...</div>
          </div>
        </div>
        <CardRoom Rooms={rooms} />



      </IonContent>
    </IonPage>
  );
};

export default Room;
