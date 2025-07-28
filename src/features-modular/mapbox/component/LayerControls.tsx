import React from 'react';

const LayerControls: React.FC<{
  layerVisibility: { wind: boolean; clouds: boolean; earthquake: boolean };
  setLayerVisibility: React.Dispatch<
    React.SetStateAction<{ wind: boolean; clouds: boolean; earthquake: boolean }>
  >;
}> = ({ layerVisibility, setLayerVisibility }) => (
  <div style={{ position: 'absolute', top: '12vh', left: '4vw', zIndex: 30, backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
    {['wind', 'clouds', 'earthquake'].map((layer) => (
      <label key={layer}>
        <input
          type="checkbox"
          checked={layerVisibility[layer as keyof typeof layerVisibility]}
          onChange={(e) =>
            setLayerVisibility((prev) => ({ ...prev, [layer]: e.target.checked }))
          }
        />{' '}
        {layer === 'wind' ? 'Viento' : layer === 'clouds' ? 'Corriente de aire' : 'Sismos'}
        <br />
      </label>
    ))}
  </div>
);

export default LayerControls;
