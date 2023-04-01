import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./Home.css"
import config from "../../config.json"


const Home: React.FC = () => {
  // Affiche le UPN de l'utilisateur
  const [upn, setUpn] = useState('a.dewulf@ephec.be');
  const [password, setPassword] = useState("MyPassword1234");
  const history = useHistory();

  async function handleLogin(event :any) {
    event.preventDefault();
    const response = await fetch(config.API_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        upn:upn,
        password:password
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('upn', data.upn);
      history.push("/implantation");
      let tabBar=document.getElementById("tabBar");
      if(tabBar != null && tabBar!= undefined){
        tabBar.style.display="flex";
      }
      
      
    } else {
      console.error('Login failed');
    }
  }
  
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="top_bar">
          <IonTitle>Accueil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form onSubmit={e => {  handleLogin(e)}}>
          <label>
            UPN:
            <input type="text" value={upn}  onChange={e => setUpn(e.target.value)} />
          </label>
          <label>
            Mot de passe:
            <input type="password" value={password}  onChange={e => setPassword(e.target.value)} />
          </label>
          <IonButton type="submit" className="button_connexion">Connexion</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Home;
