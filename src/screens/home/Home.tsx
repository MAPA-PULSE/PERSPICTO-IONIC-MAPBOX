import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import MapboxMapHome from '../../components/mapboxhome/MapboxHome';
import React from 'react';


const Home: React.FC = () => {

  return (
    <IonPage>
<<<<<<< HEAD
      <IonContent  className="ion-padding">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          {/* <IonToolbar> */}
            {/* <IonTitle size="large">Tab 1</IonTitle> */}
          {/* </IonToolbar> */}
        </IonHeader>

        <MapboxMapHome />
      </IonContent>
=======
    
      <IonContent className='main-container'>

          <IonHeader className='header-container'>
              <IonToolbar>
                  <IonTitle>Perpicto</IonTitle>
              </IonToolbar>
          </IonHeader>


          {/* Aqui agregas <IonContent></IonContent> como si fuesen div para buscador y filtros  */}


          <IonContent className='mapbox-container'>
            <MapboxMapHome />
          </IonContent>


          <IonContent className='result-search-container'>
          {/* Aqui condicionas el <IonContent></IonContent> para que te genere div para la lista de palabras encontradas
          al realizar la busqueda (item)*/}
          </IonContent>

>>>>>>> dev
      </IonContent>
    </IonPage>
  );
};

export default Home;
