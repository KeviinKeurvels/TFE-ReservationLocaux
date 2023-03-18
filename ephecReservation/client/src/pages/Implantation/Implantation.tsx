import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState, useEffect } from 'react';

//importation des autres fichiers
import './Implantation.css';
import CardImplantation from '../../components/CardImplantation/CardImplantation'
import config from "../../config.json"

const Implantation: React.FC = () => {
  //pour avoir tout les locaux
  const [implantations, setImplantations] = useState([]);
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {

        /*
    *   Récupère les informations de toutes les implantations
    */
        const controller = new AbortController();
        const signal = controller.signal;
        setIsLoading(true);
        fetch(config.API_URL + "/implantations", {signal})
          .then((res) => res.json())
          .then((res) => {
            setImplantations(res);
            setIsLoading(false);
          })
          .catch((err) => {
            if(err.name !== "AbortError"){
              console.log(err)
            }
          });
    
          return () => controller.abort();
  }, []);





  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Implantations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* This is the modal that is hidden by default */}
        <div style={{ display: isLoading ? 'flex' : 'none' }} className='modal'>
          <div className='modal-content'>
            <div className='loader'></div>
            <div className='modal-text'>Chargement en cours...</div>
          </div>
        </div>
        <CardImplantation Implantations={implantations} />



      </IonContent>
    </IonPage>
  );
};

export default Implantation;
