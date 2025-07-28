export interface LayerVisibility {
  wind: boolean;
  clouds: boolean;
  temperature: boolean;
  earthquake: boolean;
}

export type LayerId = keyof LayerVisibility;
