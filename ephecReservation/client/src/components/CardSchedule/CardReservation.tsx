import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonContent, IonCardSubtitle} from '@ionic/react';


import './CardReservation.css'

type CardReservationProps = {
  Reservations: any;
}

const CardReservation = ({ Reservations }: CardReservationProps) => {

  return (
    <IonContent>
        {Reservations.length!=0 ? Reservations.map((reservation : any) => (
          <IonCard color="warning" key={reservation["idRe"]}>
            <IonCardHeader>
              <IonCardTitle>Arnaud Dewulf</IonCardTitle>
              <IonCardSubtitle>{reservation["hourBegin"]} - {reservation["hourEnd"]}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              {reservation["title"]}
            </IonCardContent>
          </IonCard>
        ))
          :
          <h3 className='noReservation'>Aucune réservations pour le moment.</h3>
        }
    </IonContent>
  );
};

export default CardReservation;
