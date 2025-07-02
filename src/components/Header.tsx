import { IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import { useLocation } from "react-router";

export const Header = () => {
  const location = useLocation();
  if (location.pathname === "/home") return null; // oculta en home

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>Mi App</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
