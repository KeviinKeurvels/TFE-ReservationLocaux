import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonCol, IonRow } from '@ionic/react';


import './CardReservation.css'

type CardReservationProps = {
  Reservations: any;
}

const CardReservation = ({ Reservations }: CardReservationProps) => {

  return (
    <div className='content_reservation'>
      {Reservations.length != 0 ? Reservations.map((reservation: any) => (
        <IonCard color="warning" key={reservation["idRe"]}>
          <IonCardHeader>
            <IonCardTitle>{reservation["teacherName"]}</IonCardTitle>
            <IonCardSubtitle>
              {reservation["hourBegin"]} - {reservation["hourEnd"]}
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            {reservation["title"]}
            <IonRow>
              <IonCol>
                <IonButton color="success">📝 Modifier</IonButton>
              </IonCol>
              <IonCol>

                <IonButton color="danger">❌Supprimer</IonButton>
              </IonCol>
            </IonRow>
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
