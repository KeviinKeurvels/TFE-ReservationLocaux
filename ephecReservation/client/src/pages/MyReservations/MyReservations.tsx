import {
  IonCol, IonIcon, IonRow,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import React from 'react';
import {refreshOutline } from 'ionicons/icons';
import {
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
} from '@ionic/react';
//importation des autres fichiers
import './MyReservations.css';
import CardMyReservation from '../../components/CardMyReservations/CardMyReservations';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json";




const MyReservations: React.FC = () => {
  //récupération des paramètres
  let params: any;
  params = useParams();
  
  //pour avoir les reservations d'un jour
  const [reservations, setReservations] = useState([]);
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);


  const fetchAllReservationForOneUser = async () => {
    /*
    *   Récupère les informations d'une réservation pour un jour
    */
    setIsLoading(true);
    fetch(config.API_URL + "/reservations/forAnUser?idTeacher=" + params["idUser"])
      .then((res) => res.json())
      .then((res) => {
        setReservations(res);
        setIsLoading(false);
      })
      .catch((err) => console.log(err))
  }


  //le useEffect de dateChosen qui fait que quand on change de date, il va re fetch
  useEffect(() => {
    fetchAllReservationForOneUser()
  }, []);






  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Mes réservations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <ModalLoading isLoading={isLoading} />
      <IonRow>
          <IonCol>
          <IonButton fill="outline" className='reservation_top_button' onClick={()=>fetchAllReservationForOneUser()}><IonIcon icon={refreshOutline} /></IonButton>
          </IonCol>
        </IonRow>


        <IonItem>
          <CardMyReservation Reservations={reservations}  fetchAllReservationForOneUser={fetchAllReservationForOneUser} />
        </IonItem>


      </IonContent>


    </IonPage>


  );
};

export default MyReservations;
