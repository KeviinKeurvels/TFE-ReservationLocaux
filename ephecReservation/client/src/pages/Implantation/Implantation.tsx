import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonRow, IonCol } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {refreshOutline } from 'ionicons/icons';

//importation des autres fichiers
import './Implantation.css';
import CardImplantation from '../../components/CardImplantation/CardImplantation'
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import config from "../../config.json"
import {hasSqlInjection} from '../../functions/Login/Login'
//hook pour check si il y a des données
import useAuthentication from "../../hooks/checkAuthentication";

const Implantation: React.FC = () => {
  //pour avoir tout les locaux
  const [implantations, setImplantations] = useState([]);
  //pour voir quand il va fetch les données
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  //check si l'utilisateur est connecté
  useAuthentication();

  const fetchAllImplantations = async () => {
    /*
    *   Récupère les informations sur les implantations
    */
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);

    const headers = {
      'Authorization': `${localStorage.getItem('token')}`,
      'upn': `${localStorage.getItem('upn')}`
    };

    fetch(config.API_URL + "/implantations", { headers, signal })
      .then((res) => res.json())
      .then((res) => {
        setImplantations(res);
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
     *   Récupère les informations de toutes les implantations
     */
    if (localStorage.length === 0 || hasSqlInjection(localStorage.getItem('upn'), localStorage.getItem('token'))) {
      //si le localStorage est vide ou s'il il y a une injection SQL
      history.push("/home");
    }
    else {
      fetchAllImplantations()
    }

  }, []);






  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Implantations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ModalLoading isLoading={isLoading} />
        <IonRow>
          <IonCol>
          <IonButton fill="outline" className='refresh_button' onClick={()=>fetchAllImplantations()}><IonIcon icon={refreshOutline} /></IonButton>
          </IonCol>
        </IonRow>
        <CardImplantation Implantations={implantations} />



      </IonContent>
    </IonPage>
  );
};

export default Implantation;
