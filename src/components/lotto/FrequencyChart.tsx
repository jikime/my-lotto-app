"use client";

import { NumberFrequency } from "@/types/lotto";
import { LottoBall } from "./LottoBall";

interface FrequencyChartProps {
  frequencies: NumberFrequency[];
  totalGames: number;
}

export function FrequencyChart({ frequencies, totalGames }: FrequencyChartProps) {
  const maxCount = Math.max(...frequencies.map((f) => f.count), 1);
  const top10 = frequencies.slice(0, 10);
  const sorted = [...frequencies].sort((a, b) => a.number - b.number);

  if (totalGames === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">번호를 생성하면 통계가 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          상위 10개 번호
        </h3>
        <div className="space-y-2">
          {top10.map((item) => (
            <div key={item.number} className="flex items-center gap-3">
              <LottoBall number={item.number} size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 rounded-full bg-primary/80 transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%`, minWidth: "4px" }}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.count}회
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          전체 번호 빈도
        </h3>
        <div className="grid grid-cols-9 gap-1">
          {sorted.map((item) => (
            <div key={item.number} className="flex flex-col items-center gap-1">
              <LottoBall number={item.number} size="sm" />
              <span className="text-xs font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
