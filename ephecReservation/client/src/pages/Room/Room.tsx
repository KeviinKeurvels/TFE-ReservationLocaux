import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom';
//importation des autres fichiers
import './Room.css';
import CardRoom from "../../components/CardRoom/CardRoom"
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json"
//hook pour check si il y a des données
import useAuthentication from "../../hooks/checkAuthentication";

const Room: React.FC = () => {
  //récupération des paramètres
  const { nameImplantation: implantation }: any = useParams();
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);
  //pour avoir tout les locaux
  const [rooms, setRooms] = useState([]);

  const history = useHistory();
  //check si l'utilisateur est connecté
  useAuthentication();

  useEffect(() => {
    /*
    *   Récupère les informations de tout les locaux
    */
    if (localStorage.length === 0) {
      history.push("/");
    }
    else{
      const controller = new AbortController();
      const signal = controller.signal;
      setIsLoading(true);
    
      const headers = {
        'Authorization': `${localStorage.getItem('token')}`,
        'upn': `${localStorage.getItem('upn')}`
      };
    
      fetch(`${config.API_URL}/rooms/byImplantation?implantation='${implantation}'`, { headers, signal })
        .then((res) => res.json())
        .then((res) => {
          setRooms(res);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.log(err)
          }
        });
    
      return () => controller.abort();
    }

  }, [implantation]);
  





  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Locaux</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ModalLoading isLoading={isLoading} />
        <CardRoom Rooms={rooms} />



      </IonContent>
    </IonPage>
  );
};

export default Room;
