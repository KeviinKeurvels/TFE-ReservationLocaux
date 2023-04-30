import { IonContent, IonPage } from '@ionic/react';

function NotFound() {
  return (
    <IonPage>
      <IonContent>
        <h1>404 - Page not found</h1>
        <p>The page you requested does not exist.</p>
        <img src='https://media1.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif' alt="Error Android" />
      </IonContent>
    </IonPage>
  );
}

export default NotFound;
