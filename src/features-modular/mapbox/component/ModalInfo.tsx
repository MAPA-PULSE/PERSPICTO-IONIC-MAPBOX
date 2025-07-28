import React from 'react';
import { IonModal, IonButton } from '@ionic/react';

const ModalInfo: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  content: string | null;
}> = ({ isOpen, onClose, content }) => (
  <IonModal isOpen={isOpen} onDidDismiss={onClose} className="custom-modal">
    <div style={{ padding: '1rem' }}>
      <h2>Detalles</h2>
      <div dangerouslySetInnerHTML={{ __html: content || '' }} />
      <IonButton expand="full" onClick={onClose}>
        Cerrar
      </IonButton>
    </div>
  </IonModal>
);

export default ModalInfo;
