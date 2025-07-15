// CustomButton.tsx
import React from 'react';
import { IonButton } from '@ionic/react';

export interface CustomButtonProps {
  label: string;
  onClick: () => void;
  expand?: 'block' | 'full' | undefined;
  color?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  expand = 'block',
  color = 'primary',
  disabled = false,
}) => {
  return (
    <IonButton expand={expand} color={color} onClick={onClick} disabled={disabled}>
      {label}
    </IonButton>
  );
};

export default CustomButton;
