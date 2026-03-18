"use client";

import { LottoGame } from "@/types/lotto";
import { formatGameLabel } from "@/lib/lotto";
import { LottoBall } from "./LottoBall";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, RefreshCw, Trash2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface LottoGameCardProps {
  game: LottoGame;
  index: number;
  onToggleFavorite: (id: string) => void;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
  onSave?: (id: string) => void;
}

export function LottoGameCard({
  game,
  index,
  onToggleFavorite,
  onRegenerate,
  onDelete,
  onSave,
}: LottoGameCardProps) {
  return (
    <Card className={cn("transition-all duration-200", game.isFavorite && "ring-2 ring-yellow-400")}>
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
            {formatGameLabel(index)}
          </div>
          <div className="flex items-center gap-1.5 flex-1 flex-wrap">
            {game.numbers.map((num) => (
              <LottoBall key={num} number={num} size="md" animate />
            ))}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onSave && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-500 hover:text-blue-600"
                onClick={() => onSave(game.id)}
                title="히스토리에 저장"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", game.isFavorite && "text-yellow-500")}
              onClick={() => onToggleFavorite(game.id)}
              title="즐겨찾기"
            >
              <Star className="h-4 w-4" fill={game.isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRegenerate(game.id)}
              title="다시 생성"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(game.id)}
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
