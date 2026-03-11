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
