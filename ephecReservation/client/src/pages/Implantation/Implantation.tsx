import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState, useEffect } from 'react';

//importation des autres fichiers
import './Implantation.css';
import CardImplantation from '../../components/CardImplantation/CardImplantation'
import config from "../../config.json"

const Implantation: React.FC = () => {
  //pour avoir tout les locaux
  const [implantations, setImplantations] = useState([]);


  const fetchImplantations = async () => {
    /*
    *   Récupère les informations de tout les locaux
    */

      fetch(config.API_URL + "/implantations")
        .then((res) => res.json())
        .then((res) => {
          setImplantations(res);
        })
        .catch((err)=>console.log(err))
  }

  useEffect(() => {

    fetchImplantations()
  }, []);





  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Implantations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <CardImplantation Implantations={implantations} />



      </IonContent>
    </IonPage>
  );
};

export default Implantation;
