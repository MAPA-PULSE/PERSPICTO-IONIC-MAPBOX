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
import useLogin from "../../common/hooks/useLogin";
import "./Login.css";

const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showToast,
    setShowToast,
    toastMessage,
    onLogin,
    loading,
  } = useLogin();

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle className="ion-text-center">Perspicto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding ion-text-center login-content">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <h2 className="title">Iniciar sesión</h2>

              <IonList>
                <IonItem>
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
                    autocomplete="current-password"
                  />
                </IonItem>
              </IonList>

              <IonButton
                expand="block"
                color="primary"
                onClick={onLogin}
                disabled={loading || !email || !password}
                className="ion-margin-top"
              >
                {loading ? <IonSpinner name="crescent" /> : "Entrar"}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color="danger"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
