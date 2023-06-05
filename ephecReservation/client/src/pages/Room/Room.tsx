import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonRow, IonCol } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import {refreshOutline } from 'ionicons/icons';
//importation des autres fichiers
import './Room.css';
import CardRoom from "../../components/CardRoom/CardRoom"
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json"
import {hasSqlInjection} from '../../functions/Login/Login'
//hook pour check si il y a des données
import useAuthentication from "../../hooks/checkAuthentication";

const Room: React.FC = () => {
  //récupération des paramètres
  const { idImplantation: implantation }: any = useParams();
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);
  //pour avoir tout les locaux
  const [rooms, setRooms] = useState([]);

  const history = useHistory();
  //check si l'utilisateur est connecté
  useAuthentication();

  const fetchAllRooms = async () => {
    /*
    *   Récupère les informations sur les locaux
    */
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);
  
    const headers = {
      'Authorization': `${localStorage.getItem('token')}`,
      'upn': `${localStorage.getItem('upn')}`
    };
  
    fetch(`${config.API_URL}/rooms/byImplantation?implantation=${implantation}`, { headers, signal })
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
  useEffect(() => {
    /*
    *   Récupère les informations de tout les locaux
    */
    if (localStorage.length === 0 || hasSqlInjection(localStorage.getItem('upn'), localStorage.getItem('token'))) {
      //si le localStorage est vide ou s'il il y a une injection SQL
      history.push("/");
    }
    else{
      fetchAllRooms();
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
        <IonRow>
          <IonCol>
          <IonButton fill="outline" className='refresh_button' onClick={()=>fetchAllRooms()}><IonIcon icon={refreshOutline} /></IonButton>
          </IonCol>
        </IonRow>
        <CardRoom Rooms={rooms} />



      </IonContent>
    </IonPage>
  );
};

export default Room;
