import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonItem, IonCardSubtitle } from '@ionic/react';


import './CardReservation.css'

type CardReservationProps = {
  Reservations: any;
}

const CardReservation = ({ Reservations }: CardReservationProps) => {

  return (
    <div className='content_reservation'>
      <h1 id="title_schedule">Réservations</h1>
      {Reservations.length != 0 ? Reservations.map((reservation: any) => (
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
    </div>
  );
};

export default CardReservation;
