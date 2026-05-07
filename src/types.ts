export interface FoodItem {
  id: string;
  name: string;
  expiryDate: string; // ISO Date string
  createdAt: number;
}

export type Status = 'expired' | 'warning' | 'safe';
