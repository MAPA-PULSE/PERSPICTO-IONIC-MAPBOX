// PERSPICTO-IONIC-MAPBOX\src\pages-public\register\Register.tsx
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonToast,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import useRegister from "../../common/hooks/useRegister";
import "./Register.css";

const Register: React.FC = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showToast,
    setShowToast,
    toastMessage,
    loading,
    onRegister,
    clearFields,
  } = useRegister();

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle className="ion-text-center">Perspicto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent  className="ion-padding register-content ion-text-center">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <h2 className="title">Crear cuenta</h2>

              <IonList>
                <IonItem >
                  <IonLabel position="floating">Nombre completo</IonLabel>
                  <IonInput
                    value={name}
                    onIonChange={(e) => setName(e.detail.value!)}
                    disabled={loading}
                    autocomplete="name"
                  />
                </IonItem>

                <IonItem >
                  <IonLabel position="floating">Correo electrónico</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    disabled={loading}
                    inputMode="email"
                    autocomplete="email"
                    spellCheck={false}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Contraseña</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    disabled={loading}
                    autocomplete="new-password"
                  />
                </IonItem>
              </IonList>

              <IonButton
                expand="block"
                color="danger"
                onClick={clearFields}
                disabled={loading}
                className="ion-margin-top register-button"
              >
                Limpiar
              </IonButton>

              <IonButton
                expand="block"
                color="primary"
                onClick={onRegister}
                disabled={loading || !name || !email || !password}
                className="ion-margin-top register-button"
              >
                {loading ? <IonSpinner name="crescent" /> : "Registrarse"}
              </IonButton>

              <p className="login-link">
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color="tertiary"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
