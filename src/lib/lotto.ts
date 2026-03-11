import { LottoGame, NumberFrequency } from "@/types/lotto";

export function generateLottoNumbers(): number[] {
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
}

export function generateMultipleGames(count: number): LottoGame[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    numbers: generateLottoNumbers(),
    createdAt: new Date(),
    isFavorite: false,
  }));
}

export function getBallColor(number: number): string {
  if (number <= 10) return "bg-yellow-400 text-yellow-900";
  if (number <= 20) return "bg-blue-500 text-white";
  if (number <= 30) return "bg-red-500 text-white";
  if (number <= 40) return "bg-gray-600 text-white";
  return "bg-green-500 text-white";
}

export function getBallBorderColor(number: number): string {
  if (number <= 10) return "border-yellow-500";
  if (number <= 20) return "border-blue-600";
  if (number <= 30) return "border-red-600";
  if (number <= 40) return "border-gray-700";
  return "border-green-600";
}

export function calculateFrequency(games: LottoGame[]): NumberFrequency[] {
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) freq[i] = 0;
  games.forEach((game) => {
    game.numbers.forEach((n) => {
      freq[n] = (freq[n] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .map(([number, count]) => ({ number: Number(number), count }))
    .sort((a, b) => b.count - a.count || a.number - b.number);
}

export function formatGameLabel(index: number): string {
  const labels = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차"];
  return labels[index] || String(index + 1);
}
