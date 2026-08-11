export type Location = {
  lat: number;
  lng: number;
};
export type Egg = {
  id?: string;
  title?: string;
  description?: string;
  color?: string;
  coords?: Location;
  user?: Location;
  isCollected?: boolean;
  points?: number;
};
