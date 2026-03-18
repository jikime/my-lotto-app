export interface LottoGame {
  id: string;
  numbers: number[];
  createdAt: Date;
  isFavorite: boolean;
}

export interface NumberFrequency {
  number: number;
  count: number;
}

export interface SavedLottoGame {
  id: string;
  numbers: number[];
  savedAt: string; // ISO string for localStorage serialization
}
