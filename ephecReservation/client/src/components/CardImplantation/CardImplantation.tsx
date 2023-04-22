import { IonCard, IonCardHeader, IonCardContent, IonCardTitle} from '@ionic/react';
import { useHistory } from 'react-router-dom';


type CardImplantationProps = {
  Implantations: any;
}

const CardImplantation  = ({ Implantations }: CardImplantationProps) => {
  const history = useHistory();

  function redirectToRooms(nameImplantation : number) {
    //va rediriger vers la page room de l'implantation
    history.push("/room/"+nameImplantation);
  }

  return (
    <div>
    {Implantations.map((implantation: any) => (
      <IonCard onClick={() => redirectToRooms(implantation["name"])} key={implantation["idIm"]}>
        <IonCardHeader>
          <IonCardTitle>{implantation["name"]}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {implantation["description"]}
        </IonCardContent>
      </IonCard>
    ))}
    </div>
  );
};

export default CardImplantation;
